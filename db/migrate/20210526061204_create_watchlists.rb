class CreateWatchlists < ActiveRecord::Migration[6.1]
  def change
    create_table :watchlists do |t|
      t.references :user
      t.string :symbol
      t.integer :quantity
      t.integer :price
      t.datetime :business_date
      t.integer :category, default: 0
      t.text :remarks

      t.timestamps
    end
  end
end
