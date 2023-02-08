import instance from "../config";

// 查詢購物車
export async function cart() {
  const res = await instance({
    method: "GET",
    url: `/api/shopping_cart/view`,
  });

  return res.data;
}

// 加入購物車
export async function addToCart(params) {
  const res = await instance({
    method: "POST",
    url: `/api/shopping_cart/create`,
    data: params,
  });

  return res.data;
}

// 刪除購物車
export async function deleteCart(shoppingCartId) {
  const res = await instance({
    method: "DELETE",
    url: `/api/shopping_cart/delete/${shoppingCartId}`,
  });

  return res.data;
}

// 更新購物車
export async function updateCart(shoppingCartId, params) {
  const res = await instance({
    method: "PUT",
    url: `/api/shopping_cart/edit/${shoppingCartId}`,
    data: params,
  });

  return res.data;
}

// 查詢優惠券
export async function coupon(couponCode) {
  const res = await instance({
    method: "GET",
    url: `/api/coupon/${couponCode}`,
  });

  return res.data;
}

// 確認結帳
export async function purchase(params) {
  const res = await instance({
    method: "POST",
    url: `/api/order/generate_order`,
    data: params,
  });

  return res.data;
}
