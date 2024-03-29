import React, { useState } from "react";
import { base_url, port } from "../../../../../Consts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore, { Navigation, Thumbs } from "swiper";
import ReactImageMagnify from "react-image-magnify";
SwiperCore.use([Navigation, Thumbs]);
const ImageSlider = (props) => {
  // for localization
  const { rimProps, rsProps, varPics, setSwiper, style, fetchData } = props;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div style={style?.maindivforSilder}>
      {(() => {
        if (varPics.length !== 0) {
          return (
            <div>
              <Swiper
                spaceBetween={20}
                speed={2500}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper }}
                onSwiper={(s) => {
                  setSwiper(s);
                }}
                // style={style.mainSwiper}
                {...rsProps}
              >
                {varPics?.map((section) => {
                  return section.image?.map((image, i) => {
                    return (
                      <SwiperSlide key={image} style={style.swiperMainImage}>
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: "image",
                              isFluidWidth: true,
                              // width: 430,
                              // height: 500,
                              src: `http://${base_url}:${port}/images/products/${image}`,
                              sizes:
                                "(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px",
                            },
                            largeImage: {
                              src: `http://${base_url}:${port}/images/products/${image}`,
                              width: 1200,
                              height: 1800,
                            },
                            lensStyle: { backgroundColor: "rgba(0,0,0,.6)" },
                          }}
                          {...rimProps}
                        />
                      </SwiperSlide>
                    );
                  });
                })}
              </Swiper>
              <Swiper
                onClick={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={10}
                freeMode={true}
                watchSlidesProgress={true}
                style={style.ThumbsSwiper}
              >
                {varPics?.map((section) => {
                  return section.image?.map((image) => {
                    return (
                      <SwiperSlide key={image}>
                        <img
                          src={`http://${base_url}:${port}/images/products/${image}`}
                          style={style?.thumbsImage}
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
            <div>
              <Swiper
                spaceBetween={20}
                speed={2500}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper }}
                onSwiper={(s) => {
                  setSwiper(s);
                }}
                // style={style.mainSwiper}
                {...rsProps}
              >
                {JSON.parse(fetchData.image).map((image) => {
                  return (
                    <SwiperSlide key={image} style={style.swiperMainImage}>
                      <ReactImageMagnify
                        {...{
                          smallImage: {
                            alt: "image",
                            isFluidWidth: true,
                            // width: 430,
                            // height: 500,
                            src: `http://${base_url}:${port}/images/products/${image}`,
                            sizes:
                              "(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px",
                          },
                          largeImage: {
                            src: `http://${base_url}:${port}/images/products/${image}`,
                            width: 1200,
                            height: 1800,
                          },
                          lensStyle: { backgroundColor: "rgba(0,0,0,.6)" },
                        }}
                        {...rimProps}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <Swiper
                onClick={setThumbsSwiper}
                spaceBetween={5}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                style={style.ThumbsSwiper}
              >
                {JSON.parse(fetchData.image)?.map((image) => {
                  return (
                    <SwiperSlide key={image}>
                      <img
                        src={`http://${base_url}:${port}/images/products/${image}`}
                        style={style?.thumbsImage}
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
