class FetchTodayPriceService < ApplicationService
  attr_reader :form_id, :business_date
  def initialize(form_id, business_date)
    @form_id = form_id
    @business_date = business_date
  end

  def call
    response = RestClient.post("https://newweb.nepalstock.com/api/nots/nepse-data/today-price?size=500&businessDate=#{business_date}",
                               { id: form_id.to_i }.to_json, { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'\
                                  ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 'Accept': 'application/json', origin: 'https://newweb.nepalstock.com' })
    JSON.parse(response.body).dig('content')
  end
end