class WatchlistsController < ApplicationController
  before_action :set_watchlist, only: %i[update destroy]

  def index
    records = policy_scope(Watchlist).all
    if params[:transaction_type].present?
      records = records.where(transaction_type: params[:transaction_type])
    end
    render json: WatchlistSerializer.new(records).serializable_hash.as_json
  end

  def create
    watchlist = Watchlist.new(watchlist_params)
    if watchlist.save
      render json: WatchlistSerializer.new(watchlist).serializable_hash.as_json
    else
      render json: watchlist.errors, status: :unprocessable_entity
    end
  end

  def update
    if @watchlist.update(watchlist_params)
      render json: WatchlistSerializer.new(@watchlist).serializable_hash.as_json
    else
      render json: @watchlist.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @watchlist.destroy
  end

  private

  def set_watchlist
    @watchlist = policy_scope(Watchlist).find(params[:id])
  end

  def watchlist_params
    permitted_params = params.require(:watchlist).permit(:symbol, :transaction_type, :quantity, :price, :business_date)
    permitted_params.merge(user_id: current_user.id)
  end
end