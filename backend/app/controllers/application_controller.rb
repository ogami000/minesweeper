class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::Helpers

  # before_action :authenticate_user!

  # Deviseの未認証時のリダイレクトを防ぐ
  def authenticate_user!
    unless user_signed_in?
      render json: { error: 'ログインしてください' }, status: :unauthorized
    end
  end
end
