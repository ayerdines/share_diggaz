class ShareTransaction < ApplicationRecord
  enum transaction_type: %i[buy sell]
end
