class CompaniesController < ApplicationController
  def index
    companies = CompanySerializer.new(Company.all).serializable_hash.as_json
    render json: companies
  end

  def sector_options
    render json: Company.sectors.keys.map { |sector| { label: sector.titleize, value: sector } }
  end

  def symbols
    render json: Company.includes(:price_histories).equity.A.distinct.map { |company| { label: "#{company.symbol} (LTP: #{company.last_price_history&.close_price})", value: company.symbol } }
  end

  def symbol_options
    render json: Company.select(:symbol, :security_name, :sector).where("(symbol ilike ? OR security_name ilike ?) AND instrument_type = 0 AND status = 0", "%#{params[:term]}%", "%#{params[:term]}%")
  end

  def sector_summary
    summary = FetchSectorSummaryService.call
    render json: summary
  end

  def today_price
    render json: {}, status: :unprocessable_entity and return if form_id.blank? || business_date.blank?
    summary = FetchTodayPriceService.call(form_id, business_date)
    render json: summary
  end

  def sync
    authorize Company
    SyncCompaniesJob.perform_later
    render json: {}, status: :ok
  end

  def toggle_status
    company = Company.find(params[:id])
    status =
      if company.status == 'A'
        'S'
      else
        'A'
      end
    if company.update(status: status)
      render json: CompanySerializer.new(company).serializable_hash.as_json
    else
      render json: company.errors, status: :unprocessable_entity
    end
  end

  private

  def form_id
    if params[:form_id].present?
      CacheStore.find_or_initialize_by(key: 'form_id').tap do |record|
        record.update(entry: params[:form_id])
      end
      params[:form_id]
    else
      CacheStore.find_by(key: 'form_id')&.entry
    end
  end

  def business_date
    if params[:business_date].present?
      CacheStore.find_or_initialize_by(key: 'business_date').tap do |record|
        record.update(entry: params[:business_date])
      end
      params[:business_date]
    else
      CacheStore.find_by(key: 'business_date')&.entry
    end
  end
end
