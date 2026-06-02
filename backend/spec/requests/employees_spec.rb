require 'rails_helper'

RSpec.describe "Employees API", type: :request do
  # 基礎データ（これは使い回してOK）
  let!(:department) { Department.create!(name: "Engineering", code: "ENG") }
  let!(:project1) { Project.create!(name: "Project Alpha") }
  let!(:project2) { Project.create!(name: "Project Beta") }
  
  # ★ テストごとに毎回データベースを掃除してから、新しく一人だけ社員を作るように変更
  before(:each) do
    # 確実に古いデータを消し去る（お掃除の念押し）
    Employee.destroy_all 
    
    @employee = Employee.create!(
      employee_id: "EMP001",
      name: "John Doe",
      department: department,
      role: "member",
      is_retired: false,
      registered_on: "2026-01-01"
    )
    @employee.projects << project1
  end

  # ① 一覧取得APIのテスト
  describe "GET /employees" do
    it "社員一覧と所属プロジェクトが正常に取得できること" do
      get "/employees"
      
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      
      expect(json.size).to eq(1)
      expect(json[0]["name"]).to eq("John Doe")
      expect(json[0]["projects"].size).to eq(1)
      expect(json[0]["projects"][0]["name"]).to eq("Project Alpha")
    end
  end

  # ② 新規登録APIのテスト
  describe "POST /employees" do
    let(:valid_attributes) do
      {
        employee: {
          employee_id: "EMP002", # ★ 既存の EMP001 と被らないID
          name: "Alice Smith",
          department_id: department.id,
          role: "manager",
          is_retired: false,
          registered_on: "2026-06-01",
          project_ids: [project1.id, project2.id]
        }
      }
    end

    it "複数のプロジェクトを紐付けて新しく社員を登録できること" do
      expect {
        post "/employees", params: valid_attributes
      }.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
      
      new_employee = Employee.find_by(employee_id: "EMP002")
      expect(new_employee.projects.count).to eq(2)
    end
  end
end