import React from "react";
import styles from "../../styles/card.module.scss";
import currencyFormat from "../../utils/currencyFormat";
import stopMutiPress from "../../utils/preventDoubleClick";
import { DotWave } from "@uiball/loaders";

export default function Card(props) {
  const { id, name, price, capacity, des, img, func, instock, theme } = props;
  return (
    <div className={[styles.card, styles[theme.theme]].join(" ")}>
      <React.Suspense fallback={<DotWave size={47} speed={1} color="black" />}>
        <div className={styles.card_pic}>
          <img className={styles.sliderImgs} src={img} alt="product pictures" />
        </div>
      </React.Suspense>

      <div className={styles.card_content}>
        <h4 className={styles.card_title}>{name}</h4>
        <h6 className={styles.card_tag}>
          特價：{currencyFormat(price).replace("$ ", "")}元
        </h6>
        <p className={styles.card_des}>{des}</p>
        <button
          className={
            instock === 0
              ? [styles.card_btn, styles.disabled].join(" ")
              : styles.card_btn
          }
          onClick={() => {
            stopMutiPress(func, id);
          }}
          disabled={instock === 0}
        >
          {instock === 0 ? "已售罄" : "立即選購"}
        </button>
      </div>
    </div>
  );
}
