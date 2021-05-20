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
        price_change = nil
        volume_change = nil
        last_price_history = company.price_histories.where.not(business_date: price_history['businessDate']).order(business_date: :desc).first

        close_price = price_history['closePrice']
        previous_day_close_price = price_history['previousDayClosePrice'] || last_price_history&.close_price
        if previous_day_close_price.present? && previous_day_close_price != 0 && close_price.present?
          price_change = ((price_history['closePrice'] - previous_day_close_price) * 100).to_f/previous_day_close_price
        end

        total_traded_quantity = price_history['totalTradedQuantity']
        if total_traded_quantity.present? && (last_price_history&.total_traded_quantity.present? && last_price_history&.total_traded_quantity != 0)
          volume_change = ((price_history['totalTradedQuantity'] - last_price_history.total_traded_quantity) * 100).to_f/last_price_history.total_traded_quantity
        end

        price_history = company.price_histories.find_or_initialize_by(
          symbol: company.symbol,
          business_date: price_history['businessDate']
        ).tap do |price|
          price.update(
            average_traded_price: price_history['averageTradedPrice'],
            last_updated_time: price_history['lastUpdatedTime'],
            close_price: close_price,
            open_price: price_history['openPrice'],
            low_price: price_history['lowPrice'],
            high_price: price_history['highPrice'],
            total_traded_quantity: total_traded_quantity,
            total_traded_value: price_history['totalTradedValue'],
            total_trades: price_history['totalTrades'],
            previous_day_close_price: previous_day_close_price,
            price_change: price_change,
            volume_change: volume_change,
          )
        end
        price_history.save
      end
    end
  end
end