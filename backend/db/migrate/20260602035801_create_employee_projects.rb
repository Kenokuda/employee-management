class CreateEmployeeProjects < ActiveRecord::Migration[7.1]
  def up
    create_table :employee_projects do |t|
      t.references :employee, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.timestamps
    end

    # ★ 既存の文字列データ（"Project X" など）を新しいテーブルへ移行する省エネロジック
    Employee.reset_column_information
    Employee.find_each do |employee|
      next if employee.read_attribute(:project).blank?
      
      # 文字列からProjectレコードを探すか、なければ新規作成
      project = Project.find_or_create_by!(name: employee.read_attribute(:project))
      # 中間テーブルに紐付けを登録
      EmployeeProject.create!(employee: employee, project: project)
    end

    # データ移行が終わったので、古い単一の project カラムを削除
    remove_column :employees, :project, :string
  end

  def down
    # ロールバック（元に戻す）用の処理
    add_column :employees, :project, :string
    
    EmployeeProject.find_each do |ep|
      ep.employee.update_column(:project, ep.project.name)
    end

    drop_table :employee_projects
  end
end
