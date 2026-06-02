# 1. 部署の初期データ
dev_dept = Department.find_or_create_by!(name: "Development", code: "DEV")
hr_dept  = Department.find_or_create_by!(name: "Human Resources", code: "HR")

# 2. プロジェクトの初期データ
proj_a = Project.find_or_create_by!(name: "Project Alpha")
proj_b = Project.find_or_create_by!(name: "Project Beta")
proj_g = Project.find_or_create_by!(name: "Project Gamma")
proj_x = Project.find_or_create_by!(name: "Global Expansion")

# 3. 社員の初期データ（古い project: カラムを削除し、新構造に対応）
emp1 = Employee.find_or_create_by!(employee_id: "EMP001") do |e|
  e.name = "Kento Nakamura"
  e.department = dev_dept
  e.role = "admin"
  e.is_retired = false
  e.registered_on = "2026-01-01"
end

# ★ 複数プロジェクトを安全に紐付ける（すでに紐付いていなければ追加）
emp1.projects << proj_a unless emp1.projects.include?(proj_a)
emp1.projects << proj_b unless emp1.projects.include?(proj_b)

puts "🌱 Seeds planted successfully!"