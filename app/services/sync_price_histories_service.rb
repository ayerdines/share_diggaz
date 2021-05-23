# frozen_string_literal: true

class SyncPriceHistoriesService < ApplicationService
  attr_reader :sectors, :symbols, :page, :size
  def initialize(sectors=[], symbols=[], page = 0, size = 10)
    @sectors = sectors
    @symbols = symbols
    @page = page
    @size = size
  end

  def call
    model = Company
    model = model.where(sector: sectors) if sectors.present?
    model = model.where(symbol: symbols) if symbols.present?
    model.find_each do |company|
      Nepse::PriceHistories.fetch(company.nepse_company_id, page, size).reverse_each do |price_history|
        save_to_database(company, price_history)
        break if size == 1
      end
    end
  end

  def save_to_database(company, price_history)
    price_history.transform_keys!(&:underscore)
    price_change = nil
    volume_change = nil
    last_price_history = company.price_histories.where('business_date < ?', price_history['business_date']).order(business_date: :desc).first

    close_price = price_history['close_price']
    previous_day_close_price = price_history['previous_day_close_price'] || last_price_history&.close_price
    if previous_day_close_price.present? && previous_day_close_price != 0 && close_price.present?
      price_change = ((close_price - previous_day_close_price) * 100).to_f/previous_day_close_price
    end

    total_traded_quantity = price_history['total_traded_quantity']
    if total_traded_quantity.present? && (last_price_history&.total_traded_quantity.present? && last_price_history&.total_traded_quantity != 0)
      volume_change = ((total_traded_quantity - last_price_history.total_traded_quantity) * 100).to_f/last_price_history.total_traded_quantity
    end

    company.price_histories.find_or_initialize_by(
      symbol: company.symbol,
      business_date: price_history['business_date']
    ).tap do |price|
      price.attributes = price_history.reject { |k, _| k == 'id' || !price.attribute_names.index(k)}
      price.update(
        price_change: price_change,
        volume_change: volume_change
      )
    end
  end
end