class CreateCompanies < ActiveRecord::Migration[6.1]
  def change
    create_table :companies do |t|
      t.string :security_name
      t.string :symbol
      t.integer :sector
      t.integer :instrument_type
      t.integer :nepse_company_id
      t.timestamps
    end

    add_index :companies, :nepse_company_id
    add_index :companies, :sector
    add_index :companies, :symbol
  end
end
