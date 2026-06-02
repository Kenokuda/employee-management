class Employee < ApplicationRecord
  belongs_to :department

  has_many :employee_projects, dependent: :destroy
  has_many :projects, through: :employee_projects

  # ★ 社員IDの一意性・必須チェックに加え、正規表現（EMP+数字）の形式を強制する
  validates :employee_id, presence: true, uniqueness: true,
            format: { with: /\AEMP\d+\z/, message: "must start with 'EMP' followed by numbers (e.g., EMP001)" }
  validates :name, presence: true
end