class SyncFinancialReportJob < ApplicationJob
  queue_as :default

  def perform(*args)
    SyncFinancialReportsService.call(*args)
  end
end
