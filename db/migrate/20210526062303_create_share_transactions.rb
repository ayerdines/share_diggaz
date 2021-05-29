class CreateShareTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :share_transactions do |t|
      t.references :user
      t.string :symbol
      t.integer :transaction_type, default: 0
      t.integer :quantity
      t.integer :price
      t.datetime :business_date

      t.timestamps
    end
  end
end
