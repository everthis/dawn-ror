class AddAvatarsToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :avatars, :string
  end
end
