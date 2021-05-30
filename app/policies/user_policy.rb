class UserPolicy < ApplicationPolicy
  def create?
    user.admin?
  end

  def show?
    create?
  end

  def update?
    create?
  end

  def destroy?
    create?
  end

  def index?
    create?
  end
end