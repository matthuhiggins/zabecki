# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_zabecki_session',
  :secret      => '55aa26e0e733b084ccacc1745ef371b892efa17141431d2954bd71dbf5a96e5246693f63bb39087bda527888316cbf3d1bf2cb28d77612bc7f6d02a8f13992a9'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
