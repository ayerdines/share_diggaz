class CreateFinancialReports < ActiveRecord::Migration[6.1]
  def change
    create_table :financial_reports do |t|
      t.string :symbol
      t.integer :year
      t.integer :quarter
      t.decimal :net_profit, precision: 16, scale: 2
      t.decimal :net_interest_income, precision: 16, scale: 2
      t.decimal :distributable_profit, precision: 16, scale: 2
      t.decimal :shares_outstanding, precision: 16, scale: 2
      t.decimal :book_value, precision: 16, scale: 2
      t.decimal :eps, precision: 16, scale: 2
      t.decimal :roe, precision: 16, scale: 2

      t.timestamps
    end

    add_index :financial_reports, :symbol
    add_index :financial_reports, :year
    add_index :financial_reports, [:year, :quarter]
  end
end
