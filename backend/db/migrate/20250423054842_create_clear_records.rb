class CreateClearRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :clear_records do |t|
      t.references :user, null: true, foreign_key: true
      t.integer :time_in_seconds, null: false

      t.timestamps
    end
  end
end
