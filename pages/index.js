import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/index.module.scss";
import Swal from "sweetalert2";

// component
import Sliders from "../components/Slider";

// api
import { carousel, orderState } from "../service";

export default function Home() {
  const router = useRouter();
  const [carouselImgs, setCarouselImgs] = React.useState({});
  async function _carousel() {
    const res = await carousel();
    if (res.ok) {
      setCarouselImgs(res.data);
    }
  }

  async function _orderState() {
    const res = await orderState(router.query.orderNo);
    if (res && res.ok) {
      if (res.data && res.data.orderStateId === 1) {
        Swal.fire({
          icon: "success",
          title: "訂單已成立並請儘速付款",
          html:
            `您的訂單編號為 ${router.query.orderNo}` +
            "<br />" +
            "付款尚未完成，查看您的電子信箱確認相關付款資訊",
          showConfirmButton: false,
        });
      }
      if (
        (res.data && res.data.orderStateId === 2) ||
        (res.data && res.data.orderStateId === 3) ||
        (res.data && res.data.orderStateId === 4)
      ) {
        Swal.fire({
          icon: "success",
          title: "訂單已成立",
          html:
            `您的訂單編號為 ${router.query.orderNo}` +
            "<br />" +
            "請查看您的電子信箱確認相關訊息",
          showConfirmButton: false,
        });
      }
      if (
        (res.data && res.data.orderStateId === 5) ||
        (res.data && res.data.orderStateId === 6)
      ) {
        Swal.fire({
          icon: "error",
          title: "訂單成立失敗",
          html: `您的付款被拒絕，請確定您的結帳資訊再嘗試一次`,
          showConfirmButton: false,
          footer:
            '<a href="https://line.me/R/ti/p/%40923tapfg" target="_blank" style="text-decoration: underline; color: #F58397;" >如果不斷嘗試失敗請點擊此處，我們將盡快與您聯繫</a>',
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "訂單成立失敗",
        html: `您的訂單成立被拒絕，請與客服聯繫協助商品訂購。`,
        showConfirmButton: false,
        footer:
          '<a href="https://line.me/R/ti/p/%40923tapfg" target="_blank" style="text-decoration: underline; color: #F58397;" >如果不斷嘗試失敗請點擊此處，我們將盡快與您聯繫</a>',
      });
    }
  }

  React.useEffect(() => {
    _carousel();
    if (router.query && router.query.orderNo) {
      _orderState();
    }
      console.log(router.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <div>
      {/* <HTMLHead /> */}
      <main id="index" className={styles.main}>
        <Sliders data={carouselImgs} />
      </main>
    </div>
  );
}
