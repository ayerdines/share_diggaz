class FinancialReportSerializer
  include JSONAPI::Serializer
  attributes :id, :year, :symbol, :quarter, :net_profit, :net_interest_income, :distributable_profit, :shares_outstanding, :book_value, :eps, :roe
end
