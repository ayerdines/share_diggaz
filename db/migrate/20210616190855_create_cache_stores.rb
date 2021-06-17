class CreateCacheStores < ActiveRecord::Migration[6.1]
  def change
    create_table :cache_stores do |t|
      t.string :key
      t.text :entry

      t.timestamps
    end
    add_index :cache_stores, :key
  end
end
