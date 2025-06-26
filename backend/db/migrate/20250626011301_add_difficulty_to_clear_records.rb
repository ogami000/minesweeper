class AddDifficultyToClearRecords < ActiveRecord::Migration[8.0]
  def change
    add_column :clear_records, :difficulty, :string, default: "medium", null: false
  end
end
