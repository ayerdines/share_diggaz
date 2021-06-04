class FinancialReportsController < ApplicationController
  before_action :set_financial_report, only: %i[update destroy]

  def index
    symbols =
      if params[:sector].present?
        Company.select(:symbol).equity.A.where(sector: params[:sector]).order(:symbol).pluck(:symbol)
      else
        [params[:symbol]]
      end
    records = FinancialReport.where(symbol: symbols)
    quarters = records.distinct.order(year: :desc, quarter: :asc).pluck(:year, :quarter)
    if params[:ratios].present?
      last_quarter = quarters&.last
      records = records.where(year: last_quarter.dig(0), quarter: last_quarter.dig(1))
    end
    close_prices = PriceHistory.distinct.where(symbol: symbols).order(:symbol, business_date: :desc).as_json(only: [:symbol, :close_price])
    render json: FinancialReportSerializer.new(records.order(:symbol, :year, quarter: :desc), { params: { include_ratios: true },
                                                   meta: { quarters: quarters, symbols: symbols, close_prices: close_prices }}).serializable_hash.as_json
  end

  def create
    financial_report = FinancialReport.new(financial_reports_params)
    if financial_report.save
      render json: FinancialReportSerializer.new(financial_report).serializable_hash.as_json
    else
      render json: financial_report.errors, status: :unprocessable_entity
    end
  end

  def update
    if @financial_report.update(financial_reports_params)
      render json: FinancialReportSerializer.new(@financial_report).serializable_hash.as_json
    else
      render json: @financial_report.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @financial_report.destroy
  end

  def sync
    authorize FinancialReport
    symbols =
      if params[:sector]
        Company.select(:symbol).equity.A.where(sector: params[:sector]).pluck(:symbol)
      else
        [params[:symbol]]
      end
    SyncFinancialReportJob.perform_later(symbols, FinancialReport.years.keys)
  end

  private

  def set_financial_report
    @financial_report = FinancialReport.find(params[:id])
  end

  def financial_reports_params
    params.require(:financial_report).permit(:year, :quarter, :net_profit, :net_interest_income, :distributable_profit, :shares_outstanding, :book_value, :eps, :roe)
  end
end