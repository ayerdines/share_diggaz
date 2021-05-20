class CreatePriceHistories < ActiveRecord::Migration[6.1]
  def change
    create_table :price_histories do |t|
      t.references :company, null: false
      t.string :symbol, index: true
      t.datetime :business_date, index: true
      t.decimal :average_traded_price, precision: 8, scale: 2
      t.decimal :price_change, precision: 8, scale: 2
      t.decimal :volume_change, precision: 8, scale: 2
      t.integer :close_price
      t.integer :previous_day_close_price
      t.integer :high_price
      t.integer :open_price
      t.integer :low_price
      t.datetime :last_updated_time
      t.bigint :total_traded_quantity, index: true
      t.bigint :total_traded_value
      t.bigint :total_trades

      t.timestamps
    end
  end
end
