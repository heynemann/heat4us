require "time"

class Heatmap
  @queue = :heatmap

  def self.perform(user_id, url, dt, width, height, clicks, hovers, scrolls)
    dt = Time.at(dt)
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

    Heatmap.update(user_id, url, dt, width, height, clicks, hovers, scrolls)
  end

  def self.get_quadrant(width, height, x, y)
    quadrant_x = (x / 25).to_i
    quadrant_y = (y / 25).to_i

    quadrant = quadrant_y * (width / 25).to_i + quadrant_x
  end

  def self.get_key(user_id, url, prefix, suffix)
    return "#{ user_id }-#{url}-#{ prefix }-#{ suffix }"
  end

  def self.update_items_for(coll, suffix, user_id, url, dt, width, height)
    minute_prefix = dt.strftime('%Y-%m-%d-%H-%M')
    hour_prefix = dt.strftime('%Y-%m-%d-%H')
    day_prefix = dt.strftime('%Y-%m-%d')

    coll.each do |item|
      quadrant = get_quadrant(width, height, item[0], item[1])
      minute_key = get_key(user_id, url, minute_prefix, suffix)
      hour_key = get_key(user_id, url, hour_prefix, suffix)
      day_key = get_key(user_id, url, day_prefix, suffix)

      minute_val = $redis.getrange(minute_key, quadrant, quadrant + 4).unpack('l')[0]
      hour_val = $redis.getrange(minute_key, quadrant, quadrant + 4).unpack('l')[0]
      day_val = $redis.getrange(minute_key, quadrant, quadrant + 4).unpack('l')[0]
      minute_val = 0 if minute_val.nil?
      hour_val = 0 if hour_val.nil?
      day_val = 0 if day_val.nil?

      minute_val += 1
      hour_val += 1
      day_val += 1

      $redis.setrange(minute_key, quadrant, [minute_val].pack('l'))
      $redis.setrange(hour_key, quadrant, [hour_val].pack('l'))
      $redis.setrange(day_key, quadrant, [day_val].pack('l'))
    end
  end

  def self.update(user_id, url, dt, width, height, clicks, hovers, scrolls)
    update_items_for(clicks, 'clicks', user_id, url, dt, width, height)
    update_items_for(hovers, 'hovers', user_id, url, dt, width, height)
  end

end
