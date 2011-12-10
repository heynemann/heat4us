class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user
  helper_method :user_signed_in?

  private

  def current_user
    begin
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    rescue Mongoid::Errors::DocumentNotFound
      reset_session
      nil
    end
  end

  def user_signed_in?
    !!current_user
  end

  def login_required!
    unless current_user
      redirect_to signin_url
    end
  end
end
