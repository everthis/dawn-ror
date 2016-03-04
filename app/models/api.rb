class Api < ActiveRecord::Base
	validates :uri, presence: true, length: { maximum: 255 },
					  uniqueness: { case_sensitive: false }
end
