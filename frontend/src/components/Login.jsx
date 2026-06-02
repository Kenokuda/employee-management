export default function Login({
  username,
  setUsername,
  isAuthenticating,
  handleLogin,
  locale,
  setLocale,
  isDarkMode,
  t,
  inputStyle,
}) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">👤 {t.title}</h1>
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {t.loginDesc}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.labelUsername}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isAuthenticating}
              className={inputStyle}
              placeholder="admin"
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md disabled:bg-blue-400"
          >
            {isAuthenticating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t.loadingAuth}</span>
              </>
            ) : (
              <>
                <span>🔑</span>
                <span>{t.btnLogin}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className={`p-1 text-xs border rounded ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-600"}`}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
