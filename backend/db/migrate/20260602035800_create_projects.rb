class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      t.string :name

      t.timestamps
    end
    add_index :projects, :name, unique: true
  end
end
