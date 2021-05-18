class CreateCompanies < ActiveRecord::Migration[6.1]
  def change
    create_table :companies do |t|
      t.integer :active_status
      t.string :security_name
      t.string :symbol
      t.integer :sector

      t.timestamps
    end

    add_index :companies, :sector
    add_index :companies, :symbol
  end
end
