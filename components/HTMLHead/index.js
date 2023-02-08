import React from "react";
import Head from "next/head"

export default function HTMLHead(props) {
  const { theme } = props;
  return (
    <Head>
      <title>{theme.ogTitle || "瀚英科技 維護"}</title>
      {theme.describe && <meta name="description" content={theme.describe} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {theme.describe && (
        <meta property="og:description" content={theme.describe} />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {theme.ogImage && <meta property="og:image" content={theme.ogImage} />}
      {theme.ogTitle && <meta property="og:title" content={theme.ogTitle} />}
      {theme.pageIcon && <link rel="icon" href={theme.pageIcon} />}
    </Head>
  );
}

export async function getStaticProps() {
  // Get external data from the file system, API, DB, etc.
  const data = 0;

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: data,
  };
}
