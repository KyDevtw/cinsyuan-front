import instance from "../config";

// 查詢輪播圖片列表
export async function carousel() {
  const res = await instance({
    method: "GET",
    url: `/api/home_img/list`,
  });

  return res.data;
}

// 前端查詢目錄
export async function menu(meunId) {
  const res = await instance({
    method: "GET",
    url: `/api/menu/${meunId}`,
  });

  return res.data;
}

// 前端查詢目錄列表
export async function menuList() {
  const res = await instance({
    method: "GET",
    url: `/api/menu/list`,
  });

  return res.data;
}

// 前端查詢訂單狀態
export async function orderState(orderNo) {
  const res = await instance({
    method: "GET",
    url: `/api/order/state/${orderNo}`,
  });

  return res.data;
}

// 前端查詢網站設定
export async function theme() {
  const res = await instance({
    method: "GET",
    url: `/api/web_setting/view`,
  });

  return res.data;
}

