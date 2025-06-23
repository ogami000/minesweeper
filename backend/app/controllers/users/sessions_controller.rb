module Users
  class SessionsController < Devise::SessionsController
    respond_to :json

    private

    def respond_with(resource, _opts = {})
      render json: { message: 'ログイン成功', user: resource }, status: :ok
    end

    def respond_to_on_destroy
      head :no_content
    end
  end
end
