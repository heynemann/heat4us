
class HeatmapsController < ApplicationController

  def new
    dt = Time.at(request.params['dt'].to_i / 1000)
    width = request.params['w'].to_i
    height = request.params['h'].to_i

    clicks = request.params['cl'] || ''
    hovers = request.params['ho'] || ''
    scrolls = request.params['sc'] || ''

    Resque.enqueue(Heatmap, dt, width, height, clicks, hovers, scrolls)
    render :text => 'ok'
  end

end
