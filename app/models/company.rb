# frozen_string_literal: true

class Company < ApplicationRecord
  enum sector: %i[commercial_banks development_banks finance hotels_and_tourism
                  hydro_power investment life_insurance
                  manufacturing_and_processing microfinance non_life_insurance
                  tradings others]
  enum active_status: %i[active inactive]
  validates :security_name, :symbol, :active_status, :sector, presence: true
  validates_uniqueness_of :symbol
end
