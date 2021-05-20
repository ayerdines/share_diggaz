# frozen_string_literal: true

module Nepse
  class Companies
    def self.fetch
      response = RestClient.get('https://newweb.nepalstock.com/api/nots/company/list',
                                { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'\
                                        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36' })
      JSON.parse(response.body)
    end
  end
end
