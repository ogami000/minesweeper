# class ApplicationController < ActionController::API
#   include ActionController::MimeResponds
#   include ActionController::Helpers
# 　include Devise::Controllers::Helpers


#   # before_action :authenticate_user!

#   # Deviseの未認証時のリダイレクトを防ぐ
#   def authenticate_user!
#     unless user_signed_in?
#       render json: { error: 'ログインしてください' }, status: :unauthorized
#     end
#   end
# end

class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::Helpers
  include Devise::Controllers::Helpers

  # before_action :authenticate_optional_user!

  private

  def authenticate_optional_user!
    # AuthorizationヘッダーのJWTがあれば認証を試みる
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      # WardenのJWT認証を呼び出す
      env['warden'].authenticate(:jwt)
    end
    # トークンがなくてもエラーにせず、current_userはnilのままにする
  end
end
