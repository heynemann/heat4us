require 'rubygems'
require 'sinatra'
require 'redis'
require 'time'

require_relative 'updater'

get '/' do
    erb :test
end

get '/c' do
    redis = Redis.new(:host => "127.0.0.1", :port => 6379)

    dt = Time.at(request.params['dt'].to_i / 1000)
    width = request.params['w'].to_i
    height = request.params['h'].to_i

    clicks = request.params['cl'].split('@').map do |item|
        items = item.split(',')
        [items[0].to_i, items[1].to_i]
    end

    hovers = request.params['ho'].split('@').map do |item|
        items = item.split(',')
        [items[0].to_i, items[1].to_i]
    end

    scrolls = request.params['sc'].split('@').map do |item|
        items = item.split(',')
        [items[0].to_i, items[1].to_i]
    end

    upd = Updater.new
    upd.update(redis, dt, width, height, clicks, hovers, scrolls)

    "ok"
end
