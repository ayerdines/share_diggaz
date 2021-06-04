# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: 'auth', controllers: {
    sessions: 'users/sessions'
  }

  resources :users, only: %i[index show create update destroy]
  resources :companies, only: %i[index] do
    member do
      post :toggle_status
    end
    collection do
      get :sector_options
      get :symbol_options
      get :symbols
      post :sync
    end
  end

  resources :price_histories, only: %i[index] do
    collection do
      post :sync
    end
  end

  resources :watchlists, only: %i[index show create update destroy] do
    collection do
      get :categories
    end
  end
  resources :financial_reports, only: %i[index create update destroy] do
    collection do
      post :sync
    end
  end

  get '*path', to: 'home#dashboard', via: :all, constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
  root 'home#dashboard'
end
