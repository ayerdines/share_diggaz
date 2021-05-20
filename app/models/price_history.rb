class PriceHistory < ApplicationRecord
  belongs_to :company

  validates_uniqueness_of :business_date, scope: :company_id
end
