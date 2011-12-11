class Heatmap
  @queue = :heatmap

  def self.perform(dt, width, height, clicks, hovers, scrolls)
    p dt
    p width
    p height
    p clicks
    p hovers
    p scrolls

    clicks = clicks.split('@').map do |item|
      items = item.split(',')
      [items[0].to_i, items[1].to_i]
    end

    hovers = hovers.split('@').map do |item|
      items = item.split(',')
      [items[0].to_i, items[1].to_i]
    end

    scrolls = scrolls.split('@').map do |item|
      items = item.split(',')
      [items[0].to_i, items[1].to_i]
    end

  end

  #def self.get_key(prefix, suffix, width, height, x, y)
    #quadrant_x = (x / 25).to_i
    #quadrant_y = (y / 25).to_i

    #quadrant = quadrant_y * (width / 25).to_i + quadrant_x

    #"#{ prefix }-#{ quadrant }-#{ suffix }"
  #end

  #def self.update(redis, dt, width, height, clicks, hovers, scrolls)
    #minute_prefix = dt.strftime('%Y-%m-%d-%H-%M')
    #hour_prefix = dt.strftime('%Y-%m-%d-%H')
    #day_prefix = dt.strftime('%Y-%m-%d')

    #minute_list_key = "#{ minute_prefix }-list-clicks"
    #hour_list_key = "#{ hour_prefix }-list-clicks"
    #day_list_key = "#{ day_prefix }-list-clicks"

    #clicks.each do |item|
      #minute_key = get_key(minute_prefix, "clicks", width, height, item[0], item[1])
      #hour_key = get_key(hour_prefix, "clicks", width, height, item[0], item[1])
      #day_key = get_key(day_prefix, "clicks", width, height, item[0], item[1])

      #redis.sadd minute_list_key, minute_key
      #redis.sadd hour_list_key, hour_key
      #redis.sadd day_list_key, day_key
      #redis.incr minute_key
      #redis.incr hour_key
      #redis.incr day_key
    #end

    #minute_list_key = "#{ minute_prefix }-list-hovers"
    #hour_list_key = "#{ hour_prefix }-list-hovers"
    #day_list_key = "#{ day_prefix }-list-hovers"

    #hovers.each do |item|
      #minute_key = get_key(minute_prefix, "hovers", width, height, item[0], item[1])
      #hour_key = get_key(hour_prefix, "hovers", width, height, item[0], item[1])
      #day_key = get_key(day_prefix, "hovers", width, height, item[0], item[1])

      #redis.sadd minute_list_key, minute_key
      #redis.sadd hour_list_key, hour_key
      #redis.sadd day_list_key, day_key
      #redis.incr minute_key
      #redis.incr hour_key
      #redis.incr day_key
    #end

  #end

end
