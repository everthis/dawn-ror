class AddUserToApis < ActiveRecord::Migration[4.2]
  def change
    add_reference :apis, :user, index: true, foreign_key: true
  end
end
