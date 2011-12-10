class User
  include Mongoid::Document

  field :provider, type: String
  field :uid, type: String, required: true
  field :name, type: String

  def self.find_or_create_omniauth(auth, current_user = nil)
    auth_info = auth['info']
    uid = auth_info['email']

    user = current_user || User.where(:uid => uid).first || new(:uid => uid)
    user.name = auth_info['name']
    user.save!
    user
  end
end