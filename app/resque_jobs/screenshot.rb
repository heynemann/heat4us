require "time"
require "aws/s3"

class PageScreenshot < AWS::S3::S3Object
  set_current_bucket_to 'heat4us_screenshots'
end


class Screenshot
  @queue = :screenshot

  def self.perform(weburl)
    name = (0...8).map{65.+(rand(25)).chr}.join
    system "python webkit2png.py -W 1280 -H 1024 -o #{ name } --dir=/tmp #{ weburl }"
    system "convert -quality 60 /tmp/#{ name }-full.png /tmp/#{ name }-full.jpg"

    AWS::S3::Base.establish_connection!(
      :access_key_id     => '1245Q9P5EC2SGTJJ8182',
      :secret_access_key => 'GHLW3rGxG8o8xDUzp8St2cfj7BSb66lkOv5ZENwr'
    )

    PageScreenshot.store("#{ name }-full.jpg", open("/tmp/#{ name }-full.jpg"), :access => :public_read)
  end

end
