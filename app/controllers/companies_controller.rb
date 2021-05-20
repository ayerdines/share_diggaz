class CompaniesController < ApplicationController
  def index
    companies = CompanySerializer.new(Company.all).serializable_hash.as_json
    render json: companies
  end

  def sector_options
    render json: Company.sectors.keys.map {|sector| { label: sector.titleize, value: sector }}
  end

  def sync
    SyncCompaniesJob.perform_later
    render json: {}, status: :ok
  end
end
