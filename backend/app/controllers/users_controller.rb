class UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: { nickname: current_user.nickname}
  end
end
