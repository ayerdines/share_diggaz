class PriceHistoriesController < ApplicationController
  def index
    last_3_business_dates = PriceHistory
                                 .select(:business_date).where(business_date: 10.days.ago..Float::INFINITY).distinct.order(business_date: :desc)
                                 .limit(3)

    symbols = Company.select(:symbol).equity.A.where(sector: params.require(:sector)).pluck(:symbol)
    records = PriceHistory.where(symbol: symbols, business_date: (last_3_business_dates.last&.business_date)..Float::INFINITY).order(:symbol, business_date: :desc)
    render json: PriceHistorySerializer.new(records, meta: { last_3_business_dates: last_3_business_dates }).serializable_hash.as_json
  end

  def sync
    authorize PriceHistory
    sector = params.require(:sector)
    size = params[:last_day].present? ? 1 : 10
    SyncPriceHistoriesJob.perform_later([sector], nil, 0, size)
    render json: {}, status: :ok
  end
end
