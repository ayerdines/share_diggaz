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
end
