import React from "react";
import Image from "next/image";
import styles from "../../styles/list.module.scss";

// utils
import currencyFormat from "../../utils/currencyFormat";

export default function List(props) {
  const { id, name, price, qty, img, instock, func, updateFunc, theme } = props;
  const [productQty, setProductQty] = React.useState(qty);

  function quantity(max) {
    let items = [<option key={0}>{0}</option>];
    for (let i = 1; i <= max; i++) {
      items.push(<option key={i}>{i}</option>);
    }
    return items;
  }

  React.useEffect(() => {
    if (productQty === 0) {
      func(id);
    }else{
      updateFunc(id, productQty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productQty]);

  React.useEffect(() => {
    if (qty === 0) {
      func(id);
    } else {
      setProductQty(qty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  return (
    <div className={[styles.list, styles[theme.theme]].join(" ")}>
      <div className={styles.list_img}>
        <div className={styles.img}>
          <img src={img} alt="product pictures" />
          {/* <Image
            src={img}
            width="100%"
            height="100%"
            objectFit="cover"
            alt="product pitures"
          /> */}
        </div>
      </div>
      <div className={styles.title_tag}>
        <h4 className={styles.list_title}>{name}</h4>
        <h6 className={styles.list_tag}>NT{currencyFormat(price)}</h6>
      </div>
      <div className={styles.list_qty}>
        數量
        <select
          className={styles.qty_option}
          value={productQty}
          onChange={(e) => {
            setProductQty(+e.target.value);
          }}
        >
          {quantity(instock)}
        </select>
      </div>
      <div className={styles.list_qty_del}>
        <h6 className={styles.total_price}>
          NT{currencyFormat(productQty * price)}
        </h6>
        <button
          className={styles.del_btn}
          type="button"
          onClick={() => {
            func(id);
          }}
        >
          <div className={styles.del_icon}>
            <Image
              width={13.7}
              height={14}
              src="/icons/delect.png"
              alt="cinsyuan logo"
            />
          </div>
          刪除
        </button>
      </div>
    </div>
  );
}
