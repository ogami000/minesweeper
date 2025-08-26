class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::Helpers
  include Devise::Controllers::Helpers

  private

  def authenticate_optional_user!
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      env['warden'].authenticate(:jwt)
    end
  end
end
