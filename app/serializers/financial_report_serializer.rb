class FinancialReportSerializer
  include JSONAPI::Serializer
  attributes :id, :year, :symbol, :quarter, :net_profit, :net_interest_income, :distributable_profit, :shares_outstanding, :book_value, :eps, :roe

  attribute :pbv, if: proc { |_, params| params && params[:include_ratios] == true } do |record|
    (record.close_price.to_f/record.book_value).round(2)
  end

  attribute :close_price, if: proc { |_, params| params && params[:include_ratios] == true }

  attribute :pe, if: proc { |_, params| params && params[:include_ratios] == true } do |record|
    (record.close_price.to_f/record.eps).round(2)
  end

  attribute :dpps, if: proc { |_, params| params && params[:include_ratios] == true } do |record|
    ((record.distributable_profit.to_f * 4000)/(3 * record.shares_outstanding)).round(2)
  end
end
