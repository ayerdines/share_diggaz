class UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]
  before_action -> { authorize(User) }, only: %i[index create]

  def index
    records = User.all
    render json: UserSerializer.new(records).serializable_hash.as_json
  end

  def show
    render json: UserSerializer.new(@user).serializable_hash.as_json
  end

  def create
    byebug
    user = User.new(user_params)
    if user.save
      render json: UserSerializer.new(user).serializable_hash.as_json
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: UserSerializer.new(@user).serializable_hash.as_json
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  private

  def set_user
    @user = User.find(params[:id])
    authorize @user
  end

  def user_params
    params.require(:user).permit(:email, :role, :password)
  end
end
