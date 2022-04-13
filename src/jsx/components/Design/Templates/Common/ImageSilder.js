import React, { useState } from "react";
import { base_url, port } from "../../../../../Consts";

import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Navigation, Thumbs } from "swiper";

SwiperCore.use([Navigation, Thumbs]);

const ImageSlider = (props) => {
  // for localization
  const { varPics, setSwiper, style, fetchData } = props;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  console.log(varPics);

  return (
    <div>
      {(() => {
        if (varPics.length !== 0) {
          return (
            <div style={style.imageSilderMainDiv}>
              <Swiper
                spaceBetween={10}
                speed={2500}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                onSwiper={(s) => {
                  setSwiper(s);
                }}
                className="mySwiper2 mt-3 mb-1 "
              >
                {varPics?.map((section) => {
                  return section.image?.map((image, i) => {
                    return (
                      <SwiperSlide key={image}>
                        <img
                          src={`http://${base_url}:${port}/images/products/${image}`}
                          style={style?.variantsImage}
                        />
                      </SwiperSlide>
                    );
                  });
                })}
              </Swiper>
              <Swiper
                onClick={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                className="mySwiper mb-3 mx-3"
              >
                {varPics?.map((section) => {
                  return section.image?.map((image) => {
                    return (
                      <SwiperSlide key={image}>
                        <img
                          src={`http://${base_url}:${port}/images/products/${image}`}
                          alt=""
                          style={style?.variantsThumbs}
                        />
                      </SwiperSlide>
                    );
                  });
                })}
              </Swiper>
            </div>
          );
        } else {
          return (
            <div style={style.imageSilderMainDiv}>
              <Swiper
                spaceBetween={20}
                speed={2500}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                onSwiper={(s) => {
                  setSwiper(s);
                }}
                className="mt-3 mb-1 border p-3"
                style={{ minHeight: "60vh" }}
              >
                {JSON.parse(fetchData.image).map((image) => {
                  return (
                    <SwiperSlide key={image}>
                      <img
                        src={`http://${base_url}:${port}/images/products/${image}`}
                        // style={style?.variantsImage}
                        style={{
                          height: "60vh",
                          width: "100%",
                          borderRadius: "5%",
                          objectFit: "contain",
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <Swiper
                onClick={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                className="mySwiper mt-3 mb-1 border p-3"
                style={{ minHeight: "10vh", cursor: "pointer" }}
              >
                {JSON.parse(fetchData.image)?.map((image) => {
                  return (
                    <SwiperSlide key={image}>
                      <img
                        src={`http://${base_url}:${port}/images/products/${image}`}
                        alt=""
                        style={style?.variantsThumbs}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default ImageSlider;
