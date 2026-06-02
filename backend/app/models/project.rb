class Project < ApplicationRecord
    # ★ 社員との多対多の関係を追加
    has_many :employee_projects, dependent: :destroy
    has_many :employees, through: :employee_projects
  
    validates :name, presence: true, uniqueness: true
  end