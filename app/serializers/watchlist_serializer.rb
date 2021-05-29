class WatchlistSerializer
  include JSONAPI::Serializer
  attributes :id, :symbol, :transaction_type, :quantity, :price, :business_date, :last_price_history
end
