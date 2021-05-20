class SyncCompaniesJob < ApplicationJob
  queue_as :default

  def perform(*args)
    SyncCompaniesService.call(*args)
  end
end
