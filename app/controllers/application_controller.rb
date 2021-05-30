class ApplicationController < ActionController::Base
  include Pundit
  before_action :authenticate_user!

  rescue_from Pundit::NotAuthorizedError, with: :not_authorized

  respond_to :html, :json

  private

  def not_authorized
    render json: { message: 'You are not authorized to perform this action.', success: false}, status: :unauthorized
  end
end
