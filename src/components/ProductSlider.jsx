import { React, useState, useRef } from "react";
import { Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./PostSlider.css";

const ProductSlider = ({ images }) => {
  return (
    <div>
      <Swiper
        modules={[Pagination, A11y]}
        slidesPerView={1}
        autoHeight={true}
        pagination={{ clickable: false, dynamicBullets: true }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              className="w-full h-full pb-2"
              src={`http://127.0.0.1:8000/media/${image}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
