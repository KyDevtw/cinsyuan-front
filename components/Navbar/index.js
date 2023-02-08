/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/navbar.module.scss";
import { join, map } from "lodash";

// utils
import { ThemeContext } from "../../pages/_app";

export default function Navbar(props) {
  const router = useRouter();
  const { menuId } = router.query;
  const { navItem } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [router.query]);

  return (
    <ThemeContext.Consumer>
      {(theme) => {
        return (
          <>
            <nav className={[styles.nav, styles[theme.theme]].join(" ")}>
              <div
                id="hamburger"
                className={
                  isOpen
                    ? [styles.hamburger, styles.active].join(" ")
                    : styles.hamburger
                }
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <span className={styles.line}></span>
                <span className={styles.line}></span>
                <span className={styles.line}></span>
              </div>
              <div className={styles.nav_logo}>
                <Link href="/" passHref>
                  <a>
                    {theme.logo ? (
                      <img src={theme.logo} alt={`${theme.name} logo`} />
                    ) : (
                      <h1 className={styles.logo_name}>
                        {theme.name || "LOGO"}
                      </h1>
                    )}
                    {/* <Image
                width={91.7}
                height={33.3}

                src="/logo.png"
                alt="logo"
              /> */}
                  </a>
                </Link>
              </div>
              <div className={styles.empty}></div>
            </nav>
            <div
              id="menu"
              className={
                isOpen
                  ? [styles.menu_bg, styles.open, styles[theme.theme]].join(" ")
                  : styles.menu_bg
              }
            >
              <div
                className={
                  isOpen
                    ? [styles.white_bg, styles.open].join(" ")
                    : styles.white_bg
                }
              >
                <ul
                  className={[styles.burger_menu, styles[theme.theme]].join(
                    " "
                  )}
                >
                  {map(navItem, (item) => {
                    return (
                      <React.Fragment key={item.meunId}>
                        <li
                          className={
                            menuId === String(item.meunId)
                              ? [styles.menu_items, styles.active].join(" ")
                              : styles.menu_items
                          }
                        >
                          <Link
                            href={
                              item.meunTypeId === 3
                                ? item.link
                                : item.meunTypeId === 2
                                ? `/page/${item.url}`
                                : `/${item.url}`
                            }
                          >
                            <a
                              target={
                                item.meunTypeId === 3 ? "_blank" : "_self"
                              }
                              rel="noopener noreferrer"
                              className={styles.aLink}
                            >
                              {item.title}
                            </a>
                          </Link>
                          {item.children && item.children.length !== 0 ? (
                            <ul className={styles.menu_child}>
                              {map(item.children, (child) => {
                                return (
                                  <React.Fragment key={child.meunId}>
                                    <li>
                                      <Link
                                        href={
                                          child.meunTypeId === 3
                                            ? child.link
                                            : child.meunTypeId === 2
                                            ? `/page/${child.url}`
                                            : `/${child.url}`
                                        }
                                      >
                                        <a
                                          target={
                                            child.meunTypeId === 3
                                              ? "_blank"
                                              : "_self"
                                          }
                                          rel="noopener noreferrer"
                                          className={styles.child_items}
                                        >
                                          {child.title}
                                        </a>
                                      </Link>
                                    </li>
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          ) : (
                            <></>
                          )}
                        </li>
                      </React.Fragment>
                    );
                  })}
                  {/* <li className={styles.menu_items}>
              <Link href="/" passHref>
                <a>
                  <Image
                    src="/icons/shopcar_icon.svg"
                    alt="cart icon"
                    width={22}
                    height={21}
                  />
                </a>
              </Link>
            </li> */}
                </ul>
              </div>
            </div>
          </>
        );
      }}
    </ThemeContext.Consumer>
  );
}
