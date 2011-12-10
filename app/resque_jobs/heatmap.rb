class Heatmap
  @queue = :heatmap

  def self.perform(params)
    p 'performing job'
    p params
  end
end