class PriceHistorySerializer
  include JSONAPI::Serializer
  attributes :symbol, :business_date, :average_traded_price, :price_change, :volume_change, :total_traded_quantity
end
