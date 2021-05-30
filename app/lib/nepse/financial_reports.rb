# frozen_string_literal: true

module Nepse
  class FinancialReports
    def self.fetch(symbol, year,browser)
      browser.goto "https://nepsealpha.com/ajax/financials-menu/#{symbol}?fiscal_year=#{year_mapping[year]}"
      pre = browser.element(tag_name: 'pre').wait_until(&:present?)
      pre.text
      html = JSON.parse(pre.text).dig('html')
      parse_table(html, symbol)
    end

    def self.parse_table(html, symbol)
      html_doc = Nokogiri::HTML(html)
      table = html_doc.css('table.financials-table').first
      years = parse_years(table)
      data = parse_data(table)
      format_data(years, data, symbol)
    end

    def self.parse_years(table)
      header_tr = table&.xpath('//thead/tr')&.first
      return [] if header_tr.blank?
      header_tr.css('td').map(&:text)
    end

    def self.parse_data(table)
      result = {}
      (table&.xpath('//tbody/tr') || []).each do |body_tr|
        particular = body_tr.css('td').first.text
        next if ['Net Profit', 'Net Interest Income', 'Distributable Profit', 'Shares Outstanding', 'EPS', 'Book Value', 'ROE'].exclude?(particular)
        result[particular] = body_tr.css('td').slice(1...-1).map { |e| e.text.strip.gsub(',', '').to_f rescue 0 }
      end
      result
    end

    def self.format_data(years, data, symbol)
      records = []
      years.each_with_index do |year, i|
        y, quarter = year.split('Q')
        record = {
          'symbol': symbol,
          'year': y,
          'quarter': quarter,
          'net_profit': data.dig('Net Profit', i),
          'net_interest_income': data.dig('Net Interest Income', i),
          'distributable_profit': data.dig('Distributable Profit', i),
          'shares_outstanding': data.dig('Shares Outstanding', i),
          'eps': data.dig('EPS', i),
          'book_value': data.dig('Book Value', i),
          'roe': data.dig('ROE', i)
        }
        records.push(record)
      end
      records
    end

    def self.year_mapping
      {
        '077-078' => '77078',
        '076-077' => '76077',
        '075-076' => '75076'
      }
    end
  end
end