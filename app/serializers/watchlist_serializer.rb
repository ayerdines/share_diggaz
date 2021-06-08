class WatchlistSerializer
  include JSONAPI::Serializer
  attributes :id, :symbol, :business_date, :category, :remarks
end
