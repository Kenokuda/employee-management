class EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /employees
  def index
    # ★ include を使うことで、N+1問題をプロレベルに回避（省エネ＆高速化）
    @employees = Employee.includes(:projects, :department).all
    
    # プロジェクト情報も含めてJSONをレンダリング
    render json: @employees.as_json(include: { projects: { only: [:id, :name] }, department: { only: [:name, :code] } })
  end

  # GET /employees/1
  def show
    render json: @employee.as_json(include: :projects)
  end

# POST /employees
def create
  # 1. まずプロジェクトID以外で社員の器を作る
  @employee = Employee.new(employee_params.except(:project_ids))

  if @employee.save
    # 2. 【超確実】ストロングパラメータ経由ではなく、paramsの「生の階層」から直接プロジェクトIDを取り出す
    # これにより、Railsの型判定のバグや消滅の罠を完全に回避します
    raw_project_ids = params.dig(:employee, :project_ids)

    if raw_project_ids.present?
      # 文字列の配列 ["1", "2"] で届いても、安全に数値 [1, 2] に変換して一括保存！
      @employee.project_ids = raw_project_ids.map(&:to_i)
    end

    # 3. 最後にプロジェクト情報も含めた最新の状態でフロントに返す
    render json: @employee.as_json(include: :projects), status: :created
  else
    render json: @employee.errors, status: :unprocessable_entity
  end
end

  # PATCH/PUT /employees/1
  def update
    if @employee.update(employee_params.except(:project_ids))
      if employee_params[:project_ids].present?
        @employee.project_ids = employee_params[:project_ids]
      end
      render json: @employee
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  # DELETE /employees/1
  def destroy
    @employee.destroy
  end

  private
    def set_employee
      @employee = Employee.find(params[:id])
    end

    def employee_params
      # ★ project_ids: [] を許可することで、フロントから配列でIDを受け取れるようにします
      params.require(:employee).permit(:employee_id, :name, :role, :is_retired, :registered_on, :department_id, project_ids: [])
    end
end