class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :employee_id
      t.string :name
      t.date :registered_on
      t.boolean :is_retired
      t.string :project
      t.string :role
      t.references :department, null: false, foreign_key: true

      t.timestamps
    end
  end
end
