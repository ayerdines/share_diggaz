class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :role
end
