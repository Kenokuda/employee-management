# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
   # ★ テスト環境なら全許可、それ以外（開発・本番）ならReactのみに締める！
   if Rails.env.test?
    origins '*'
  else
    origins 'http://localhost:5173'
  end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end