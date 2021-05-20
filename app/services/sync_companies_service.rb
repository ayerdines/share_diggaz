# frozen_string_literal: true

class SyncCompaniesService < ApplicationService
  def call
    Nepse::Companies.fetch.each do |company|
      Company.create({
                       security_name: company['securityName'],
                       symbol: company['symbol'],
                       sector: company['sectorName'].gsub(' ', '').underscore,
                       instrument_type: company['instrumentType'].gsub(' ', '').underscore,
                       nepse_company_id: company['id'],
                     })
    end
  end
end
