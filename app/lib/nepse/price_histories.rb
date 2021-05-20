# frozen_string_literal: true

module Nepse
  class PriceHistories
    def self.fetch(company_id, page, size)
      response = RestClient.get("https://newweb.nepalstock.com/api/nots/market/security/price/#{company_id}",
                                { params: { page: page, size: size }, 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'\
                                      ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36' })
      JSON.parse(response.body).dig('content')
    end
  end
end