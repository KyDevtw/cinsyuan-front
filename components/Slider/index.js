/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Link from "next/link";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { map } from "lodash";
import styles from "../../styles/slider.module.scss";

import useSize from "../hook/useSize";

SwiperCore.use([Autoplay]);

export default function Sliders({ data }) {
  const { width, height } = useSize();

  return (
    <Swiper
      className={styles.swiperContainer}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 5000 }}
      loop={true}
      initialSlide={1}
    >
      {map(data, (image) => {
        return (
          <SwiperSlide
            className={
              width > height ? styles.swiperSlide : styles.swiperSlideMobile
            }
            key={image.homeImgId}
          >
            <Link href={image.link} passHref>
              <img
                className={styles.sliderImgs}
                src={width > height ? image.webPath : image.mobilePath}
                alt={image.alt}
              />
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
