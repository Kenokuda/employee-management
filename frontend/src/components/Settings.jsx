export default function Settings({
  isDarkMode,
  setIsDarkMode,
  locale,
  setLocale,
  passkeyName,
  setPasskeyName,
  t,
}) {
  return (
    <div
      className={`max-w-2xl mx-auto p-6 rounded-lg shadow-sm border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        ⚙️ {t.sysSettings}
      </h2>
      <div
        className={`space-y-6 divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
      >
        <div className="flex justify-between items-center pt-4">
          <div>
            <h3 className="font-medium">{t.darkMode}</h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {t.darkModeDesc}
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isDarkMode ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"}`}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
          </button>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div>
            <h3 className="font-medium">{t.lang}</h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {t.langDesc}
            </p>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-950"}`}
          >
            <option
              value="ja"
              className={isDarkMode ? "bg-gray-800" : "bg-white"}
            >
              日本語 (Japanese)
            </option>
            <option
              value="en"
              className={isDarkMode ? "bg-gray-800" : "bg-white"}
            >
              English
            </option>
          </select>
        </div>

        <div className="pt-4">
          <h3 className="font-medium text-blue-500 dark:text-blue-400">
            🔒 {t.passkeyTitle}
          </h3>
          <p
            className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {t.passkeyDesc}
          </p>
          <div
            className={`p-4 rounded border flex justify-between items-center ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}
          >
            <div>
              <p className="text-sm font-semibold">{passkeyName}</p>
              <p className="text-xs text-gray-400">2026-06-01</p>
            </div>
            <button
              onClick={() => {
                const newName = prompt("Enter new name:", passkeyName);
                if (newName) setPasskeyName(newName);
              }}
              className={`text-xs font-medium py-1 px-3 rounded border transition-colors ${isDarkMode ? "bg-gray-600 hover:bg-gray-500 text-white border-gray-500" : "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"}`}
            >
              {t.btnRename}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
