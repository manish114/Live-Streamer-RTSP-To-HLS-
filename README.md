# RTSP to HLS Web Server

Includes Node.js backend, FFmpeg, JWT auth, auto-reconnect, recording, and Nginx for static HLS serving.


# This below command will record the camera rtsp stream in .mkv format on given path and will records 900sec in a single chunk.
#https://medium.com/@tom.humph/saving-rtsp-camera-streams-with-ffmpeg-baab7e80d767  
ffmpeg -hide_banner -y -loglevel error -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i rtsp://username:password@192.168.1.123:554/stream1 -vcodec copy -acodec copy -f segment -reset_timestamps 1 -segment_time 900 -segment_format mkv -segment_atclocktime 1 -strftime 1 %Y%m%dT%H%M%S.mkv
