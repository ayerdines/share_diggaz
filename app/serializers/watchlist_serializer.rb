class WatchlistSerializer
  include JSONAPI::Serializer
  attributes :id, :symbol, :quantity, :price, :business_date, :category, :remarks
end
