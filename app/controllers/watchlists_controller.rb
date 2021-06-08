class WatchlistsController < ApplicationController
  before_action :set_watchlist, only: %i[show update destroy]

  def index
    records = policy_scope(Watchlist)
    close_prices = PriceHistory.distinct.where(symbol: records.pluck(:symbol)).order(:symbol, business_date: :desc).as_json(only: [:symbol, :close_price])
    render json: WatchlistSerializer.new(records, meta: { close_prices: close_prices }).serializable_hash.as_json
  end

  def show
    render json: WatchlistSerializer.new(@watchlist).serializable_hash.as_json
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

  def categories
    render json: Watchlist.categories.keys.map { |category| { label: category.titleize, value: category } }
  end

  private

  def set_watchlist
    @watchlist = policy_scope(Watchlist).find(params[:id])
  end

  def watchlist_params
    permitted_params = params.require(:watchlist).permit(:symbol, :business_date, :category, :remarks)
    permitted_params.merge(user_id: current_user.id)
  end
end