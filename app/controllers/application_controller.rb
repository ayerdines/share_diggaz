class ApplicationController < ActionController::Base
  include Pundit
  before_action :authenticate_user!
  respond_to :html, :json
end
