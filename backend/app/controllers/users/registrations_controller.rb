module Users
  class RegistrationsController < Devise::RegistrationsController
    before_action :configure_sign_up_params, only: [:create]

    respond_to :json

    private

    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
    end

    def respond_with(resource, _opts = {})
      if resource.persisted?
        render json: {
          status: { code: 200, message: '登録が完了しました。' },
          data: resource
        }
      else
        render json: {
          status: { code: 422, message: "登録に失敗しました。" },
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    end
  end
end
