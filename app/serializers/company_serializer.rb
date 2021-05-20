class CompanySerializer
  include JSONAPI::Serializer
  attributes :id, :instrument_type, :security_name, :symbol, :nepse_company_id, :updated_at

  attribute :sector do |record|
    record.sector.titleize
  end
end
