/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Image from "next/image";
import styles from "../../styles/fab.module.scss";

export default function Fab(props) {
  const { line, setVisable, scrollTo, showPurchase, theme } = props;
  const [windowWidth, setWindowWidth] = React.useState(360);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  return (
    <div className={styles.fab}>
      {theme.lineIdOn && theme.lineId && (
        <button
          className={styles.option}
          onClick={() => {
            line();
          }}
        >
          <div className={styles.line_img}>
            <Image
              src="/icons/line.svg"
              alt="line"
              width="100%"
              height="100%"
            />
          </div>
        </button>
      )}
      {theme.csTelOn && theme.csTel && (
        <a href={`tel:${theme.csTel}`} className={styles.option}>
          <div className={styles.line_img}>
            <Image
              src="/icons/serviceIcon.svg"
              alt="line"
              width="100%"
              height="100%"
            />
          </div>
        </a>
      )}
      {showPurchase ? (
        <button
          className={styles.option}
          onClick={() => {
            setVisable(true);
          }}
        >
          <p className={styles.purchaseBtn}>前往結帳</p>
        </button>
      ) : (
        <></>
      )}
      <button
        className={styles.option}
        type="button"
        onClick={() => {
          scrollTo.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <div className={styles.scroll_top}></div>
      </button>
    </div>
  );
}
