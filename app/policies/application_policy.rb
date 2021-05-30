class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    user_or_admin?
  end

  def show?
    user_or_admin?
  end

  def create?
    user_or_admin?
  end

  def update?
    user_or_admin?
  end

  def destroy?
    user_or_admin?
  end

  def sync?
    user.admin?
  end

  def user_or_admin?
    user.user? || user.admin?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end
