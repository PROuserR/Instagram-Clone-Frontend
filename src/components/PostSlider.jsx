import { React, useState, useRef } from "react";
import { Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./PostSlider.css";
import { ReactComponent as VolumeMuteIcon } from "../assets/volume-mute.svg";
import { ReactComponent as VolumeUpIcon } from "../assets/volume-up.svg";
import { ReactComponent as BigFilledHeartIcon } from "../assets/heart-fill-red-big.svg";

export default ({ hasVideo, photoes }) => {
  const [volumeIcon, setVolumeIcon] = useState(<VolumeMuteIcon />);
  const [isVolumeMuted, setIsVolumeMuted] = useState(true);
  const [bigFilledHeartIcon, setBigFilledHeartIcon] = useState(null);
  const [showHeartFlag, setShowHeartFlag] = useState(false);
  let clickCounter = 0;
  let times = [];
  const video = useRef();

  const handlePlayMute = () => {
    video.current.muted = !video.current.muted;
    if (isVolumeMuted) setVolumeIcon(<VolumeUpIcon />);
    else setVolumeIcon(<VolumeMuteIcon />);
    setIsVolumeMuted(!isVolumeMuted);
  };

  const showHeart = () => {
    times.push(new Date());
    clickCounter++;
    if (times.length > 2) times.pop();

    if (
      (times[times.length - 1] - times[times.length - 2]) / 1000 < 0.3 &&
      clickCounter >= 2
    ) {
      if (showHeartFlag === false)
        setBigFilledHeartIcon(
          <BigFilledHeartIcon className="fixed pulsing-heart left-[40%] bottom-1/2 z-10" />
        );
      else setBigFilledHeartIcon(null);
      setShowHeartFlag(!showHeartFlag);
      setTimeout(() => setBigFilledHeartIcon(null), 1500);
      clickCounter = 0;
    }
  };

  if (hasVideo)
    return (
      <div onClick={showHeart}>
        <Swiper
          modules={[Pagination, A11y]}
          slidesPerView={1}
          pagination={{ clickable: false, dynamicBullets: true }}
        >
          <SwiperSlide className="h-64">
            <video
              ref={video}
              onClick={handlePlayMute}
              width="100%"
              src="https://s3-us-west-2.amazonaws.com/converterpoint-22/encodings/66f8c67e14f782d829aa93a191d5b4ea.mp4"
              autoPlay
              muted
              loop
            ></video>

            <div className="h-4 relative bottom-7 left-0 flex">
              <div className="ml-auto mr-2">{volumeIcon}</div>
            </div>
            {bigFilledHeartIcon}
          </SwiperSlide>
          <SwiperSlide>
            <video
              ref={video}
              onClick={handlePlayMute}
              width="100%"
              src="https://s3-us-west-2.amazonaws.com/converterpoint-22/encodings/66f8c67e14f782d829aa93a191d5b4ea.mp4"
              autoPlay
              muted
              loop
            ></video>

            <div className="h-4 relative bottom-7 left-0 flex">
              <div className="ml-auto mr-2">{volumeIcon}</div>
            </div>
            {bigFilledHeartIcon}
          </SwiperSlide>
        </Swiper>
      </div>
    );
  else
    return (
      <div onClick={showHeart}>
        <Swiper
          modules={[Pagination, A11y]}
          slidesPerView={1}
          autoHeight={true}
          pagination={{ clickable: false, dynamicBullets: true }}
        >
          {photoes.map((photo, index) => (
            <SwiperSlide key={index}>
              <img
                className="pb-4 mx-auto"
                src={`http://127.0.0.1:8000/media/${photo}`}
              />
              {bigFilledHeartIcon}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
};
