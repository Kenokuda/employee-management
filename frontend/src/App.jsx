import { useEffect, useState } from "react";
import Login from "./components/Login";
import EmployeeManagement from "./components/EmployeeManagement";
import Settings from "./components/Settings";
import { locales } from "./locales";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]); // ★ 選択肢としてのプロジェクト一覧を追加
  const [currentTab, setCurrentTab] = useState("management");

  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [locale, setLocale] = useState("ja");
  const [passkeyName, setPasskeyName] = useState("メイン端末のパスキー");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const t = locales[locale];

  // フォームデータ
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    role: "member",
    is_retired: false,
    registered_on: new Date().toISOString().split("T")[0],
    department_id: "",
    project_ids: [], // ★ テキストから「IDの配列」に変更！
  });

  const fetchEmployees = () => {
    fetch("http://localhost:3000/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  };

  const fetchDepartments = () => {
    fetch("http://localhost:3000/departments")
      .then((res) => res.json())
      .then((data) => {
        const activeDepts = data.filter((d) => !d.is_deleted);
        setDepartments(activeDepts);
        if (activeDepts.length > 0)
          setFormData((prev) => ({
            ...prev,
            department_id: activeDepts[0].id,
          }));
      });
  };

  // ★ Railsからプロジェクトのマスターデータを取得
  const fetchProjects = () => {
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
      fetchDepartments();
      fetchProjects(); // ★ ログイン時にプロジェクトも取得
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // ★ プロジェクトの複数選択（チェックボックス用）のハンドラー
  const handleProjectChange = (projectId) => {
    setFormData((prev) => {
      const currentIds = prev.project_ids;
      if (currentIds.includes(projectId)) {
        return {
          ...prev,
          project_ids: currentIds.filter((id) => id !== projectId),
        }; // 既に選ばれてたら外す
      } else {
        return { ...prev, project_ids: [...currentIds, projectId] }; // 選ばれてなければ追加
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ★ 送信する全体データを { employee: formData } の形に包んであげる！
    const payload = {
      employee: formData,
    };

    console.log("🚀 送信するデータの中身（包み紙付き）:", payload);

    fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // ★ 剥き出しの formData ではなく、包んだ payload を送る
    }).then((res) => {
      if (res.ok) {
        alert(t.alertSuccess);
        fetchEmployees();
        // フォームのリセット
        setFormData((prev) => ({
          ...prev,
          employee_id: "",
          name: "",
          role: "member",
          is_retired: false,
          project_ids: [],
        }));
      } else {
        res.json().then((errors) => {
          alert(
            `Error: ${Object.entries(errors)
              .map(([k, v]) => `${k} ${v}`)
              .join(", ")}`,
          );
        });
      }
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    fetch(`http://localhost:3000/employees/${id}`, { method: "DELETE" }).then(
      (res) => {
        if (res.ok) fetchEmployees();
      },
    );
  };

  const handleToggleRetire = (employee) => {
    const confirmMessage = employee.is_retired
      ? t.confirmActivate
      : t.confirmRetire;
    if (!window.confirm(confirmMessage)) return;

    fetch(`http://localhost:3000/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_retired: !employee.is_retired }),
    }).then((res) => {
      if (res.ok) fetchEmployees();
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsLoggedIn(true);
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  const inputStyle = `w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-950 placeholder-gray-400"
  }`;

  if (!isLoggedIn) {
    return (
      <Login
        username={username}
        setUsername={setUsername}
        isAuthenticating={isAuthenticating}
        handleLogin={handleLogin}
        locale={locale}
        setLocale={setLocale}
        isDarkMode={isDarkMode}
        t={t}
        inputStyle={inputStyle}
      />
    );
  }

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              👤 {t.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Logged in as:{" "}
              <span className="font-semibold text-blue-500">{username}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div
              className={`flex gap-1 p-1 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
            >
              <button
                onClick={() => setCurrentTab("management")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentTab === "management" ? (isDarkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                📂 {t.tabManagement}
              </button>
              <button
                onClick={() => setCurrentTab("settings")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentTab === "settings" ? (isDarkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                ⚙️ {t.tabSettings}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition-colors"
            >
              🚪 {t.btnLogout}
            </button>
          </div>
        </div>

        {/* タブに応じたコンポーネント表示 */}
        {currentTab === "management" ? (
          <EmployeeManagement
            formData={formData}
            handleChange={handleChange}
            handleProjectChange={handleProjectChange}
            handleSubmit={handleSubmit}
            departments={departments}
            projects={projects}
            employees={employees}
            handleToggleRetire={handleToggleRetire}
            handleDelete={handleDelete}
            isDarkMode={isDarkMode}
            t={t}
            inputStyle={inputStyle}
          />
        ) : (
          <Settings
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            locale={locale}
            setLocale={setLocale}
            passkeyName={passkeyName}
            setPasskeyName={setPasskeyName}
            t={t}
          />
        )}
      </div>
    </div>
  );
}

export default App;
