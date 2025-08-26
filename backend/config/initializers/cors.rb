Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('CORS_ORIGINS')

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :delete, :options, :head],
      credentials: true
  end
end
