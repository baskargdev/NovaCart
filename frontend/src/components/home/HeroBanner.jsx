import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import banner1 from "../../assets/banners/banner-1.png";
import banner2 from "../../assets/banners/banner-2.png";
import banner3 from "../../assets/banners/banner-3.png";
import banner4 from "../../assets/banners/banner-4.png";
import banner5 from "../../assets/banners/banner-5.png";
import banner6 from "../../assets/banners/banner-6.png";


const banners = [banner1, banner2, banner3, banner4, banner5, banner6];

const HeroBanner = () => {
  return (
    <div className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12 mt-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000 }}
        loop
        pagination={{ clickable: true }}
        navigation
        className="rounded-3xl overflow-hidden"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="w-full h-[220px] md:h-auto object-fill rounded-3xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;
