class FinancialReport < ApplicationRecord
  belongs_to :company, primary_key: :symbol, foreign_key: :symbol
  enum year: %i[077-078 076-077 075-076]

  validates_uniqueness_of :quarter, scope: %i[year symbol]

  delegate :security_name, to: :company

  def close_price
    self.company.last_price_history&.close_price
  end
end
