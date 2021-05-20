class PriceHistoriesController < ApplicationController
  def index
    last_3_business_dates = PriceHistory
                                 .select(:business_date).where(business_date: 10.days.ago..1.day.ago).distinct.order(business_date: :desc)
                                 .limit(3)

    symbols = Company.select(:symbol).where(sector: params.require(:sector), instrument_type: :equity).pluck(:symbol)
    records = PriceHistory.where(symbol: symbols, business_date: (last_3_business_dates.last&.business_date)..Float::INFINITY).order(:symbol, business_date: :desc)
    render json: PriceHistorySerializer.new(records, meta: {last_3_business_dates: last_3_business_dates}).serializable_hash.as_json
  end

  def sync
    sector = params.require(:sector)
    SyncPriceHistoriesJob.perform_later([sector])
    render json: {}, status: :ok
  end
end
