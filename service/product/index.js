import instance from "../config";

// 查詢商品
export async function product(productId) {
  const res = await instance({
    method: "GET",
    url: `/api/product/${productId}`,
  });

  return res.data;
}

// 查詢商品分類
export async function category(url) {
  const res = await instance({
    method: "GET",
    url: `/api/product/category/${url}`,
  });

  return res.data;
}

// 前端查詢分頁
export async function pages(url) {
  const res = await instance({
    method: "GET",
    url: `/api/menu/pages/${url}`,
  });

  return res.data;
}

// 前端查詢商品分類商品
export async function categoryProduct(categoryId, subCategoryId) {
  const res = await instance({
    method: "GET",
    url: `/api/product/category/${categoryId}/${subCategoryId}`,
  });

  return res.data;
}

