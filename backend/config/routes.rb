Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :clear_records, only: [:create, :index]

    devise_for :users,
      defaults: { format: :json },
      path: '',
      path_names: {
        sign_in: 'login',
        sign_out: 'logout',
        registration: 'signup'
      },
      controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      }

    get '/me', to: 'users#me'
  end
end
