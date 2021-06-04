# frozen_string_literal: true

class SyncCompaniesService < ApplicationService
  def call
    Nepse::Companies.fetch.each do |company|
      Company.find_or_initialize_by(symbol: company['symbol']).tap do |c|
        c.update(
          security_name: company['securityName'],
          status: company['status'],
          sector: company['sectorName'].gsub(' ', '').underscore,
          instrument_type: company['instrumentType'].gsub(' ', '').underscore,
          nepse_company_id: company['id'],
          )
      end
    end
  end
end
