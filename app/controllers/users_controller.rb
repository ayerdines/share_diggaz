# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @companies = Company.all
  end
end
