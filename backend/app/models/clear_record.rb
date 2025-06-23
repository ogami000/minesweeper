class ClearRecord < ApplicationRecord
  belongs_to :user, optional: true

  validates :time_in_seconds, presence: true,
                              numericality: {
                                only_integer: true,
                                greater_than_or_equal_to: 0,
                                less_than_or_equal_to: 999
                              }
end
