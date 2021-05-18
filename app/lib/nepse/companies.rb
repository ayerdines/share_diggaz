# frozen_string_literal: true

module Nepse
  class Companies
    def self.fetch
      result = []
      page_no = 0
      loop do
        response = RestClient.get('https://newweb.nepalstock.com/api/nots/security/classification',
                                  { params: { page: page_no }, 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'\
                                        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36' })
        content = JSON.parse(response.body).dig('content')
        break if content.blank?
        # byebug

        page_no += 1
        result += content
      end
      result
    end
  end
end
