import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/pages.module.scss";

// utils
import { htmlFormat } from "../../utils/htmlFormat";
import { ThemeContext } from "../_app";

// api
import { pages } from "../../service";

function useIframeHeight(ratio) {
  const [iframeHeight, setIframeHeight] = React.useState(0);

  // const getHtml = () => {
  //   if (refContent.current) {
  //      setIframeHeight(refContent.current.offsetWidth / 2);
  //   }
  // };
  // React.useEffect(() => {
  //   getHtml();
  //   window.addEventListener("resize", getHtml);
  //   return () => {
  //     window.removeEventListener("resize", getHtml);
  //   };
  // }, []);
  React.useEffect(() => {
    const getSize = () => {
      const width = window.innerWidth;
      const height_l = ratio ? ratio.large : 0.92;
      const height_s = ratio ? ratio.small : 0.92;
      width > (ratio ? ratio.breakpoint : 768)
        ? setIframeHeight(450)
        : setIframeHeight((width - 100) * 0.5625);
    };
    getSize();
    window.addEventListener("resize", getSize);
    return () => {
      window.removeEventListener("resize", getSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return iframeHeight;
}

export default function Page(props) {
  // const { data } = props;
  const router = useRouter();
  const iframeHeight = useIframeHeight();
  const [pageDate, setPageData] = React.useState({});
  const queryUrl = router.query.pageUrl;

  async function _pages() {
    const res = await pages(queryUrl);
    if (res && res.ok) {
      setPageData(res.data);
    }
  }

  React.useEffect(() => {
    _pages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <div>
            <main
              id="index"
              className={[styles.main, styles[theme.theme]].join(" ")}
            >
              <div className={styles.title}>{pageDate.title}</div>
              <div className={styles.content}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: htmlFormat(pageDate.content, iframeHeight),
                  }}
                  className="ck-content"
                />
              </div>
            </main>
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
}

// export async function getServerSideProps(context) {
//   const { query } = context;
//   const res = await pages(query.pageUrl);
//   if (res.ok) {
//     return { props: { data: res.data } };
//   } else {
//     return { props: { data: {} } };
//   }
// }
