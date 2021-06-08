class RemoveColumnsFromWatchlists < ActiveRecord::Migration[6.1]
  def change
    remove_columns :watchlists, :price, :quantity
  end
end
