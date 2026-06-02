import { useState } from "react";

export default function EmployeeManagement({
  formData,
  handleChange,
  handleProjectChange,
  handleSubmit,
  departments,
  projects,
  employees,
  handleToggleRetire,
  handleDelete,
  isDarkMode,
  t,
  inputStyle,
}) {
  // ★ ソート状態の管理（デフォルトは社員IDの昇順）
  const [sortConfig, setSortConfig] = useState({
    key: "employee_id",
    direction: "asc",
  });

  // ★ ソートを切り替える関数
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // ★ 表示用に社員データを並び替えるロジック
  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // 部署名でソートする場合のケア
    if (sortConfig.key === "department") {
      aValue = a.department?.name || "";
      bValue = b.department?.name || "";
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // ★ ソート中の列に矢印マークを表示するヘルパー
  const getClassNamesFor = (key) => {
    if (sortConfig.key !== key) return "import-sort-indicator text-gray-400";
    return sortConfig.direction === "asc"
      ? "text-blue-500 font-bold"
      : "text-blue-500 font-bold";
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return " ↕";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 左側：新規登録フォーム */}
      <div
        className={`p-6 rounded-lg shadow-sm border h-fit ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <h2 className="text-xl font-semibold mb-4">{t.formTitle}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {t.labelEmpId}
            </label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="EMP002"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {t.labelName}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="Suzuki Ichiro"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {t.labelDept}
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              className={inputStyle}
            >
              {departments.map((dept) => (
                <option
                  key={dept.id}
                  value={dept.id}
                  className={isDarkMode ? "bg-gray-800" : "bg-white"}
                >
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* プロジェクトの複数選択（チェックボックス一覧） */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {t.labelProject}
            </label>
            <div
              className={`p-3 rounded-lg border space-y-2 max-h-40 overflow-y-auto ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
            >
              {projects.length === 0 ? (
                <p className="text-xs text-gray-400">No projects available</p>
              ) : (
                projects.map((proj) => (
                  <label
                    key={proj.id}
                    className="flex items-center gap-2 text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.project_ids.includes(proj.id)}
                      onChange={() => handleProjectChange(proj.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{proj.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {t.labelRole}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputStyle}
            >
              <option
                value="member"
                className={isDarkMode ? "bg-gray-800" : "bg-white"}
              >
                {t.roleMember}
              </option>
              <option
                value="manager"
                className={isDarkMode ? "bg-gray-800" : "bg-white"}
              >
                {t.roleManager}
              </option>
              <option
                value="admin"
                className={isDarkMode ? "bg-gray-800" : "bg-white"}
              >
                {t.roleAdmin}
              </option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {t.labelDate}
            </label>
            <input
              type="date"
              name="registered_on"
              value={formData.registered_on}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            {t.btnRegister}
          </button>
        </form>
      </div>

      {/* 右側：社員一覧 */}
      <div
        className={`lg:col-span-2 p-6 rounded-lg shadow-sm border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {t.listTitle} ({employees.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-sm font-medium ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-200 text-gray-600"}`}
              >
                {/* ★ 各ヘッダーをクリック可能にし、ソート関数をバインド */}
                <th
                  className="p-3 cursor-pointer select-none hover:bg-gray-500/10 transition-colors"
                  onClick={() => requestSort("employee_id")}
                >
                  <span className={getClassNamesFor("employee_id")}>
                    {t.labelEmpId}
                    {getArrow("employee_id")}
                  </span>
                </th>
                <th
                  className="p-3 cursor-pointer select-none hover:bg-gray-500/10 transition-colors"
                  onClick={() => requestSort("name")}
                >
                  <span className={getClassNamesFor("name")}>
                    {t.labelName}
                    {getArrow("name")}
                  </span>
                </th>
                <th
                  className="p-3 cursor-pointer select-none hover:bg-gray-500/10 transition-colors"
                  onClick={() => requestSort("department")}
                >
                  <span className={getClassNamesFor("department")}>
                    {t.labelDept}
                    {getArrow("department")}
                  </span>
                </th>
                <th
                  className="p-3 cursor-pointer select-none hover:bg-gray-500/10 transition-colors"
                  onClick={() => requestSort("role")}
                >
                  <span className={getClassNamesFor("role")}>
                    {t.labelRole}
                    {getArrow("role")}
                  </span>
                </th>
                <th
                  className="p-3 cursor-pointer select-none hover:bg-gray-500/10 transition-colors"
                  onClick={() => requestSort("is_retired")}
                >
                  <span className={getClassNamesFor("is_retired")}>
                    Status{getArrow("is_retired")}
                  </span>
                </th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-sm ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
            >
              {/* ★ 元の employees ではなく、ソート済みの sortedEmployees でループ回す */}
              {sortedEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className={`transition-colors ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
                >
                  <td className="p-3 font-mono text-gray-400">
                    {emp.employee_id}
                  </td>
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3">
                    <span
                      className={`block text-xs font-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {emp.department?.name || "-"}
                    </span>
                    {/* プロジェクト列：バッジ風に複数並べて表示 */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {emp.projects && emp.projects.length > 0 ? (
                        emp.projects.map((p) => (
                          <span
                            key={p.id}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${isDarkMode ? "bg-gray-700 text-gray-300 border border-gray-600" : "bg-blue-50 text-blue-700 border border-blue-100"}`}
                          >
                            {p.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${emp.role === "admin" ? "bg-red-100 text-red-800" : emp.role === "manager" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
                    >
                      {emp.role === "admin"
                        ? t.roleAdmin
                        : emp.role === "manager"
                          ? t.roleManager
                          : t.roleMember}
                    </span>
                  </td>
                  <td className="p-3">
                    {emp.is_retired ? (
                      <span className="text-gray-400">{t.statusRetired}</span>
                    ) : (
                      <span className="text-green-500 font-medium">
                        {t.statusActive}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRetire(emp)}
                        className={`font-medium py-1 px-3 rounded text-xs transition-colors ${emp.is_retired ? "bg-green-600/20 hover:bg-green-600/30 text-green-400" : "bg-amber-600/20 hover:bg-amber-600/30 text-amber-400"}`}
                      >
                        {emp.is_retired ? t.actionActivate : t.actionRetire}
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium py-1 px-3 rounded text-xs transition-colors"
                      >
                        {t.actionDelete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
