class SyncPriceHistoriesJob < ApplicationJob
  queue_as :default

  def perform(*args)
    SyncPriceHistoriesService.call(*args)
  end
end
