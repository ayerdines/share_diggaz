class Watchlist < ApplicationRecord
  enum category: %i[general want_to_buy want_to_sell missed_buys missed_sales]

  def last_price_history
    PriceHistory.where(symbol: symbol).order(business_date: :desc)&.first&.as_json(only: [:close_price, :previous_day_close_price])
  end
end
