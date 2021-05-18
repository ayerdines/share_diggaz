# frozen_string_literal: true

class SyncCompaniesService < ApplicationService
  def call
    Nepse::Companies.fetch.each do |company|
      sector = company.dig('companyId', 'sectorMaster', 'sectorDescription').gsub(' ', '').underscore
      Company.create({
                       security_name: company['securityName'],
                       active_status: company['activeStatus'] == 'A' ? :active : :inactive,
                       symbol: company['symbol'],
                       sector: sector
                     })
    end
  end
end
