module Users
  class SessionsController < Devise::SessionsController
    respond_to :json

    private

    def respond_with(resource, _opts = {})
      token = request.env['warden-jwt_auth.token']
      Rails.logger.info "resource.id=#{resource.id}, email=#{resource.email}"


      render json: {
        message: 'ログイン成功',
        authorization: token,
        user: resource
      }, status: :ok
    end

    def respond_to_on_destroy
      head :no_content
    end
  end
end
