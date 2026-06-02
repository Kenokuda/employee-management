class CreateDepartments < ActiveRecord::Migration[7.1]
  def change
    create_table :departments do |t|
      t.string :code
      t.string :name
      t.date :established_on
      t.boolean :is_deleted

      t.timestamps
    end
  end
end
