import React from "react";
import styles from "../styles/index.module.scss";
import { useRouter } from "next/router";
import { map } from "lodash";
import Swal from "sweetalert2";

// hook
import useError from "../components/hook/useError";

// component
const Card = React.lazy(() => import("../components/Card"));
import List from "../components/List";
import PurchaseModal from "../components/Modal";
import Fab from "../components/Fab";

// unit
import { ThemeContext } from "./_app";
import { themeNum } from "../styles/theme";
import currencyFormat from "../utils/currencyFormat";

// api
import {
  category,
  categoryProduct,
  addToCart,
  cart,
  deleteCart,
  updateCart,
  coupon,
  purchase,
} from "../service";

export default function Index(props) {
  const router = useRouter();
  const menuUrl = router.query.menuUrl;
  const [couponData, setCouponData] = React.useState({});
  const [menuData, setMenuData] = React.useState({});
  const [productData, setProductData] = React.useState({
    choice: [],
    hot_items: [],
  });
  const [cartData, setCartData] = React.useState([]);
  const [purchaseData, setPurchaseData] = React.useState({
    name: "",
    email: "",
    phone: "",
    receiverStoreId: "",
    receiverStoreName: "",
    receiverStoreAddress: "",
    areaId: Number,
    address: "",
    pickupTimeId: 3,
    transportTypeId: 5,
    paymentTypeId: 1,
    couponCode: "",
    payment: 0,
    memo: "",
  });
  const [productTotal, setProductTotal] = React.useState({ ori: 0, cp: 0 });
  const [visable, setVisable] = React.useState(false);
  const [couponWarn, setCouponWarn] = React.useState("");
  const [scrollTo, setScrollTo] = React.useState();
  const [delivery, setDelivery] = React.useState(5);
  const [step, setStep] = React.useState(0);

  const { error, mapError } = useError({
    phone: "",
    email: "",
    address: "",
    name: "",
    memo: "",
  });

  function line() {
    // window.open(props.theme.lineId);
    window.open("https://lin.ee/SgylO5l");
  }

  async function _category() {
    const res = await category(menuUrl);
    if (res && res.ok) {
      setMenuData(res.data);
    }
  }

  async function _categoryProduct(type) {
    const res = await categoryProduct(menuData.categoryId, type);
    let choice = [];
    let hotItem = [];
    if (res && res.ok) {
      map(res.data, (product) => {
        product.subCategory === 1
          ? choice.push(product)
          : hotItem.push(product);
      });
      setProductData({ choice: choice, hot_items: hotItem });
    }
  }

  async function _addToCart(id) {
    const res = await addToCart({ productId: id, qty: 1 });
    if (res && res.ok) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        width: 250,
        title: `<p style="line-height: 25px;">${"??????????????????"}</p>`,
        padding: "5px 10px",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      _cart();
    } else {
      Swal.fire({
        icon: "warning",
        title: `?????????????????????`,
        text: "????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
        showConfirmButton: false,
        timer: 10000,
      });
    }
  }

  async function _deleteCart(id) {
    const res = await deleteCart(id);
    if (res && res.ok) {
      _cart();
    } else {
      Swal.fire({
        icon: "warning",
        title: res.data,
        text: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
        showConfirmButton: false,
        timer: 10000,
      });
    }
  }

  async function _coupon() {
    if (purchaseData.couponCode === "") {
      setCouponWarn("??????????????????...");
      return;
    }
    const res = await coupon(purchaseData.couponCode);
    if (res && res.ok) {
      setCouponWarn("");
      setCouponData(res.data);
    } else {
      setCouponWarn(res.error[0].message);
    }
  }

  async function _cart() {
    const res = await cart();
    let totalPrice = 0;
    let totalPriceBeforeCp = 0;
    if (res && res.ok) {
      map(res.data, (price) => {
        totalPrice += price.price * price.qty;
        totalPriceBeforeCp += price.price * price.qty;
      });
      if (couponData.discount) {
        couponData.couponTypeId === 1
          ? (totalPrice -= couponData.discount)
          : (totalPrice = Math.ceil((totalPrice * couponData.discount) / 100));
      }
      totalPrice < 0 ? (totalPrice = 0) : (totalPrice = totalPrice);
      setCartData(res.data);
      setProductTotal({ ori: totalPriceBeforeCp, cp: totalPrice });
    }
  }

  async function _updateCart(id, qty) {
    const res = await updateCart(id, { qty });
    if (res && res.ok) {
      _cart();
    }
  }

  async function _purchase() {
    let params = {
      ...purchaseData,
      phone: purchaseData.phone.replace("+", ""),
    };
    const res = await purchase(params);
    if (res && res.ok) {
      if (res.data.method) {
        // get html
        document.write(res.data.transactionWebLink);
      } else {
        // get link url
        window.location.href = res.data.transactionWebLink;
      }
    } else {
      if (!res.error) {
        setVisable(false);
        Swal.fire({
          icon: "warning",
          title: `????????????`,
          text: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
          showConfirmButton: false,
          timer: 10000,
        });
      } else {
        if (res.error[0].field === "couponCode") {
          setVisable(false);
          Swal.fire({
            icon: "warning",
            title: `????????????`,
            text: `????????????${res.error[0].message}????????????????????????????????????????????????`,
            showConfirmButton: false,
            timer: 10000,
          });
        } else if (res.error[0].field === "memo") {
          mapError(res.error);
        } else {
          setStep(1);
          mapError(res.error);
        }
      }
    }
  }

  React.useEffect(() => {
    if (productTotal.cp > 1500) {
      setPurchaseData({
        ...purchaseData,
        payment: productTotal.cp,
      });
    } else {
      const shippingFee =
        productTotal.cp >= 1500
          ? 0
          : purchaseData.transportTypeId === 1
          ? 130
          : purchaseData.transportTypeId === 2
          ? 70
          : purchaseData.transportTypeId === 3
          ? 70
          : purchaseData.transportTypeId === 4
          ? 70
          : 100;
      setPurchaseData({
        ...purchaseData,
        payment: productTotal.cp + shippingFee,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visable, cartData]);

  React.useEffect(() => {
    const shippingFee =
      productTotal.cp >= 1500
        ? 0
        : purchaseData.transportTypeId === 1
        ? 130
        : purchaseData.transportTypeId === 2
        ? 70
        : purchaseData.transportTypeId === 3
        ? 70
        : purchaseData.transportTypeId === 4
        ? 70
        : 100;
    setPurchaseData({
      ...purchaseData,
      payment: productTotal.cp + shippingFee,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseData.transportTypeId, couponData]);

  React.useEffect(() => {
    if (couponData && couponData.discount) {
      let newPrice = productTotal.ori;
      couponData.couponTypeId === 1
        ? (newPrice -= couponData.discount)
        : (newPrice = Math.ceil((newPrice * couponData.discount) / 100));
      newPrice < 0 ? (newPrice = 0) : (newPrice = newPrice);
      setProductTotal({ ...productTotal, cp: newPrice });
      setPurchaseData({ ...purchaseData, payment: newPrice });
    } else {
      setProductTotal({ ...productTotal, cp: productTotal.ori });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponData]);

  React.useEffect(() => {
    menuData.categoryId && _categoryProduct(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuData.categoryId]);

  React.useEffect(() => {
    _category();
    _cart();
    setScrollTo(document.getElementById("index"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuUrl]);

  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <div>
            <main
              id="index"
              className={[styles.main, styles[theme.theme]].join(" ")}
            >
              <div className={styles.container}>
                <div className={[styles.intro, styles[theme.theme]].join(" ")}>
                  {map(menuData.categoryImg, (item) => {
                    return (
                      <React.Fragment key={item.categoryImgId}>
                        <img
                          className={styles.content_img}
                          src={item.path}
                          alt={`?????????????????? ${item.categoryImgId}`}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className={styles.products_area}>
                  {productData.choice.length > 0 ? (
                    <div className={styles.products_section}>
                      <h3 className={styles.section_title}>????????????</h3>
                      {productData.choice.map((item) => {
                        return (
                          <Card
                            key={`${item.productId}c`}
                            theme={theme}
                            id={item.productId}
                            name={item.name}
                            price={item.price}
                            capacity={item.capacity}
                            instock={item.instock}
                            des={item.excerpt}
                            img={
                              (item.img.length > 0 && item.img[0].path) || "/"
                            }
                            func={_addToCart}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <></>
                  )}
                  {productData.hot_items.length > 0 ? (
                    <div className={styles.products_section}>
                      <h3 className={styles.section_title}>????????????</h3>
                      {productData.hot_items.map((item) => {
                        return (
                          <React.Fragment key={`${item.productId}h`}>
                            <Card
                              theme={theme}
                              id={item.productId}
                              name={item.name}
                              price={item.price}
                              capacity={item.capacity}
                              instock={item.instock}
                              des={item.excerpt}
                              img={
                                (item.img.length > 0 && item.img[0].path) || "/"
                              }
                              func={_addToCart}
                            />
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ) : (
                    <></>
                  )}
                  {cartData.length > 0 ? (
                    <div className={styles.products_section}>
                      <h3
                        className={[
                          styles.section_title,
                          styles.current_choose,
                        ].join(" ")}
                      >
                        ??????????????????
                      </h3>
                      {cartData.map((item) => {
                        return (
                          <React.Fragment key={item.shoppingCartId}>
                            <List
                              theme={theme}
                              id={item.shoppingCartId}
                              name={item.productName}
                              price={item.price}
                              qty={item.qty}
                              instock={item.instock}
                              img={item.path || "/"}
                              func={_deleteCart}
                              updateFunc={_updateCart}
                            />
                          </React.Fragment>
                        );
                      })}
                      <div
                        className={[
                          styles.coupon_section,
                          styles[theme.theme],
                        ].join(" ")}
                      >
                        {!couponData.couponCode ? (
                          <h6 className={styles.available_coupon}>
                            ???????????????
                          </h6>
                        ) : (
                          <div
                            className={[
                              styles.coupon_tag,
                              styles.coupon_active,
                            ].join(" ")}
                          >
                            <div className={styles.tag}>
                              {couponData.couponTypeId === 1
                                ? "????????????"
                                : "????????????"}
                            </div>
                            <p className={styles.tag_des}>
                              {couponData.couponName}
                              {"\n"}
                              {/* <span className={styles.tag_des_more}>
                          ??????????????????
                        </span> */}
                            </p>
                          </div>
                        )}
                        <div
                          className={
                            productTotal.cp < 1500
                              ? styles.coupon_tag
                              : [styles.coupon_tag, styles.coupon_active].join(
                                  " "
                                )
                          }
                        >
                          <div className={styles.tag}>????????????</div>
                          <p className={styles.tag_des}>
                            ?????????1500?????? {"\n"}
                            <span className={styles.tag_des_more}>
                              {productTotal.cp < 1500
                                ? `?????? NT$ ${
                                    1500 - productTotal.ori
                                  } ???????????? ????????????`
                                : "??????????????????"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className={styles.coupon_input}>
                        <div className={styles.input}>
                          <input
                            value={purchaseData.couponCode}
                            placeholder="??????????????????..."
                            onChange={(e) => {
                              setPurchaseData({
                                ...purchaseData,
                                couponCode: String(
                                  e.target.value
                                    .replace(/\[a-bA-B]/g, "")
                                    .replace("	", "")
                                ),
                              });
                              // _cart();
                              setCouponData({});
                              // setCode(e.target.value);
                            }}
                            // onPaste={(e) => {
                            //   setPurchaseData({
                            //     ...purchaseData,
                            //     couponCode: String(
                            //       e.clipboardData
                            //         .getData("text")
                            //         .replace(/\[a-bA-B]/g, "")
                            //         .replace("	", "")
                            //     ),
                            //   });
                            // }}
                          />
                          <p
                            onClick={() => {
                              if (
                                purchaseData.couponCode ===
                                couponData.couponCode
                              ) {
                                return;
                              } else {
                                _coupon();
                              }
                            }}
                          >
                            ???????????????
                          </p>
                        </div>
                        <p
                          className={
                            !couponWarn
                              ? styles.input_warn
                              : [styles.input_warn, styles.warn_active].join(
                                  " "
                                )
                          }
                        >
                          {couponWarn}
                        </p>
                      </div>
                      <div className={styles.total}>
                        <div className={styles.total_text}>
                          <div className={styles.hint}>????????????</div>
                          <div className={styles.hint}>????????????</div>
                          <div className={styles.title}>??????</div>
                        </div>
                        <div className={styles.total_price}>
                          <div className={styles.hint}>
                            NT {currencyFormat(productTotal.ori)}
                          </div>
                          <div className={styles.hint}>
                            - NT{" "}
                            {currencyFormat(productTotal.ori - productTotal.cp)}
                          </div>
                          <div className={styles.price}>
                            NT {currencyFormat(productTotal.cp)}
                          </div>
                        </div>
                      </div>
                      <button
                        className={[styles.purchase, styles[theme.theme]].join(
                          " "
                        )}
                        onClick={() => {
                          setVisable(true);
                        }}
                      >
                        ????????????
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <Fab
                theme={theme}
                line={line}
                visable={visable}
                setVisable={setVisable}
                scrollTo={scrollTo}
                showPurchase={cartData.length > 0}
              />
            </main>
            <PurchaseModal
              theme={theme}
              visable={visable}
              setVisable={setVisable}
              errorText={error}
              line={line}
              step={step}
              setStep={setStep}
              data={{ ...purchaseData, ...productTotal }}
              setData={setPurchaseData}
              delivery={delivery}
              setDelivery={setDelivery}
              func={_purchase}
            />
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
}

// export async function getServerSideProps(context) {
//   const { query } = context;
//   const res = await category(query.menuUrl);
//   if (res.ok) {
//     return { props: { data: res.data } };
//   } else {
//     return { props: { data: {} } };
//   }
// }
