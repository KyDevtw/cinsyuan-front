/**
 * 轉換 CKeditor <oembed></oembed>
 * @param htmlStr html語法
 * @param height 可調高度
 */
export function htmlFormat(htmlStr, height) {
  const reg = new RegExp(
    /<oembed url="https:\/\/(www\.)?youtube.com\/watch\?v=([A-Za-z0-9\_]{11})(.*)<\/oembed>/
  );

  // const reg = new RegExp(
  //   /<oembed url="http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?(.*)<\/oembed>/
  // );

  // const reg = new RegExp(
  //   /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  // );

  // <oembed url="https://www.youtube.com/watch?v=3eKF_kEjy-I"></oembed> https://www.youtube.com/watch?v=nP-nMZpLM1A
  // <oembed url="https://youtu.be/I-t2mwrYc6s"></oembed>

  const replacer = (match, p1, p2, p3) => {
    const prefix = `<iframe style="width: 100%; height: ${height}px;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="" src="https://www.youtube.com/embed/`;
    const suffix = `"></iframe>`;
    return `${prefix}${p2}${suffix}`;
  };
  // const str =
  //   '<oembed url="https://www.youtube.com/watch?v=uGjRDULYH9s"></oembed>';
  // console.log(str.replace(reg, replacer));
  return htmlStr ? htmlStr.replace(reg, replacer) : "";
}
