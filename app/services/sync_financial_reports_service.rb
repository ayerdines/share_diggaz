# frozen_string_literal: true

class SyncFinancialReportsService < ApplicationService
  attr_reader :symbols, :years
  def initialize(symbols=[], years=[])
    @symbols = symbols
    @years = years
  end

  def call
    begin
      headless = Headless.new
      headless.start

      # Specify the driver path
      chromedriver_path = Rails.root.join('app/lib/chromedriver')
      Selenium::WebDriver::Chrome::Service.driver_path = chromedriver_path.to_s

      browser = Watir::Browser.new
      symbols.each do |symbol|
        years.each do |year|
          Nepse::FinancialReports.fetch(symbol, year, browser).each do |record|
            FinancialReport.create(record)
          end
        end
      end
    rescue Exception => e
      Rails.logger.debug e.message
    ensure
      browser&.close
      headless&.destroy
    end
  end
end