import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/footer.module.scss";

import { ThemeContext } from "../../pages/_app";

export default function Footer() {
  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <footer className={[styles.footer, styles[theme.theme]].join(" ")}>
            <div className={styles.row}>
              <div className={styles.name}>{theme.name}</div>
              <div className={styles.pages}>
                <Link href={"/page/aboutus"}>關於我們</Link>
                <Link href={"/page/service"}>服務條款</Link>
                <Link href={"/page/policy"}>隱私權政策</Link>
                <Link href={"/page/purchase"}>退換貨服務</Link>
              </div>
              {theme.address && (
                <div className={styles.address}>{theme.address}</div>
              )}
              <div
                className={
                  theme.address
                    ? styles.numberMail
                    : [styles.numberMail, styles.left].join(" ")
                }
              >
                {theme.tel && <p className={styles.tel}>Tel：{theme.tel}</p>}
                {theme.fax && <p className={styles.fax}>Fax：{theme.fax}</p>}
                {theme.email && (
                  <p className={styles.mail}>Mail：{theme.email}</p>
                )}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.paymethod}>
                <div className={styles.payItems}>
                  <Image
                    src="/payment/visa.png"
                    alt="visa"
                    width={38.72}
                    height={24}
                  />
                </div>
                <div className={styles.payItems}>
                  <Image
                    src="/payment/mastercard.png"
                    alt="mastercard"
                    width={32}
                    height={24}
                  />
                </div>
                <div className={styles.payItems}>
                  <Image
                    src="/payment/jcb.png"
                    alt="jcb"
                    width={32}
                    height={24}
                  />
                </div>
                <div className={styles.payItems}>
                  <Image
                    src="/payment/ecpay.png"
                    alt="spgateway"
                    width={40}
                    height={24}
                  />
                </div>
                <div className={styles.payItems}>
                  <Image
                    src="/payment/711.png"
                    alt="711"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <div className={styles.copyright}>
                本系統由 瀚英科技 維護 © 2022
              </div>
            </div>
          </footer>
        );
      }}
    </ThemeContext.Consumer>
  );
}
