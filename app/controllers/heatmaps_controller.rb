
class HeatmapsController < ApplicationController

  def new
    user_id = request.params['id']
    dt = request.params['dt'].to_i / 1000
    width = request.params['w'].to_i
    height = request.params['h'].to_i

    clicks = request.params['cl'] || ''
    hovers = request.params['ho'] || ''
    scrolls = request.params['sc'] || ''

    Resque.enqueue(Heatmap, user_id, dt, width, height, clicks, hovers, scrolls)
    render :text => "h4.tracker.callback('#{ request.params['dt'] }');"
  end

  def index
    tracking = 'hovers'
    hour_prefix = Time.now.strftime('%Y-%m-%d-%H')
    list_key = "#{ current_user.id }-#{ hour_prefix }-list-#{ tracking }"
    @list = $redis.smembers(list_key)

    @list.map! do |item|
      keys = item.split('-')
      quadrant = keys[-2].to_i

      data = $redis.get(item)
      { :quad => quadrant, :count => data }
    end
  end

end
