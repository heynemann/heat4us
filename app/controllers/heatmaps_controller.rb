class HeatmapsController < ApplicationController

  def new
    Resque.enqueue(Heatmap, 'something aaaaaaa')
    render :text => 'ok'
  end

end
