# frozen_string_literal: true

class Company < ApplicationRecord
  has_many :price_histories
  has_many :financial_reports, primary_key: :symbol, foreign_key: :symbol

  enum sector: %i[commercial_banks development_banks finance hotels_and_tourism
                  hydro_power investment life_insurance mutual_fund
                  manufacturing_and_processing microfinance non_life_insurance
                  tradings others]
  enum instrument_type: %i[equity mutual_funds non_convertible_debentures preference_shares]
  validates :security_name, :symbol, :sector, presence: true
  validates_uniqueness_of :symbol

  def last_price_history
    self.price_histories.max_by(&:business_date)
  end
end
