/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useRouter } from "next/router";
import "../styles/globals.scss";
import "../styles/_unreset.scss";
import Script from "next/script";
import { map } from "lodash";

// component
import HTMLHead from "../components/HTMLHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// api
import { menuList, theme } from "../service";

// util
import { themeNum } from "../styles/theme";

export const ThemeContext = React.createContext();

function MyApp(props) {
  const router = useRouter();
  const { pathname } = router;
  const { Component, pageProps } = props;
  const [navItem, setNavItem] = React.useState({});
  const [themeData, setThemeData] = React.useState({});
  const fbRef = React.useRef();

  async function _menuList() {
    const res = await menuList();
    let parentArr = [];
    let childArr = [];
    if (res && res.ok) {
      map(res.data, (child) => {
        if (child.parentId !== child.meunId) {
          childArr.push(child);
        }
      });
      map(res.data, (parent) => {
        if (parent.parentId === parent.meunId && parentArr.length < 5) {
          parentArr.push(parent);
        }
      });
      map(parentArr, (parentItem, index) => {
        let childrenArr = [];
        map(childArr, (childItem) => {
          if (childItem.parentId === parentItem.meunId) {
            childrenArr.push(childItem);
          }
        });

        parentArr.splice(index, 1, { ...parentItem, children: childrenArr });
      });
      setNavItem(parentArr);
    }
  }

  async function _theme() {
    const res = await theme();
    if (res && res.ok) {
      setThemeData({
        ...res.data,
        theme: res.data.theme ? themeNum[res.data.theme] : "themeBlack",
      });
    } else {
      setThemeData({
        ...themeData,
        theme: "themeBlack",
      });
    }
  }

  React.useEffect(() => {
    _menuList();
    _theme();
  }, []);

  return (
    <React.Fragment>
      <ThemeContext.Provider value={themeData}>
        <Script
          id="fb-login"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.fbAsyncInit = function() {
              FB.init({
                // appId      : '0000000',
                cookie     : true,
                xfbml      : true,
                version    : 'v12.0'
              });
              FB.AppEvents.logPageView();
            };

            (function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/zh_TW/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));         
            
            `,
          }}
        />
        <HTMLHead theme={themeData} />
        <Navbar navItem={navItem} theme={themeData} />
        <Component {...pageProps} />
        {pathname !== "/" ? <Footer /> : <></>}
        <div id="fb-root"></div>
        <div
          ref={fbRef}
          id="fb-customer-chat"
          className="fb-customerchat"
          attribution="install_email"
          attribution_version="biz_inbox"
          page_id={themeData.messengerOn && themeData.messenger}
        ></div>
      </ThemeContext.Provider>
    </React.Fragment>
  );
}

// export async function getStaticProps() {
//   const res = await theme();
//   return {
//     props: { data: res.data },
//   };
// }

// export async function getInitialProps() {
//   const res = await theme();
//   return {
//     props: { data: res.data },
//   };
// }

// export async function getServerSideProps() {
//   const res = await menuList();
//   console.log(res);
//   if (res.ok) {
//     return { props: { navItems: res.data } };
//   }
// }

export default MyApp;
