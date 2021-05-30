class CompaniesController < ApplicationController
  def index
    companies = CompanySerializer.new(Company.all).serializable_hash.as_json
    render json: companies
  end

  def sector_options
    render json: Company.sectors.keys.map { |sector| { label: sector.titleize, value: sector } }
  end

  def symbols
    render json: Company.includes(:price_histories).where(instrument_type: :equity).distinct.map { |company| { label: "#{company.symbol} (LTP: #{company.last_price_history&.close_price})", value: company.symbol } }
  end

  def symbol_options
    render json: Company.select(:symbol, :security_name).where("symbol ilike ? OR security_name ilike ? AND instrument_type = 0", "%#{params[:term]}%", "%#{params[:term]}%").map { |company| { label: "#{company.security_name}(#{company.symbol})", value: company.symbol } }
  end

  def sync
    authorize Company
    SyncCompaniesJob.perform_later
    render json: {}, status: :ok
  end
end
