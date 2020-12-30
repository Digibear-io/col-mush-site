import remark from "remark";
import html from "remark-html";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import useWindowSize from "../hooks/useWindowSize";

import { menuStore } from "../store";
import { useState } from "react";
function Home({ contents, featured, title, subtitle }) {
  const [toggle, setToggle] = useState(menuStore.getState());
  const size = useWindowSize();
  const width = () => {
    if (size.width > 1400) {
      return "100%";
    } else {
      return "95%";
    }
  };

  menuStore.subscribe(() => setToggle(menuStore.getState()));
  return (
    <div className={styles.container}>
      <Head>
        <title>The City of Lights MUSH</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={styles.contents}
        style={{
          maxWidth:
            toggle && size.width > 1024
              ? "calc(" + width() + " - 165px)"
              : "100%",
        }}
      >
        <div
          style={{
            background: `url(${featured}) center no-repeat`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className={styles.featured}
        />
        <div className={styles.copy}>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>{subtitle}</p>
          <div dangerouslySetInnerHTML={{ __html: contents }} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://lights-api.herokuapp.com/home");
  const data = await res.json();
  const contents = (
    await remark()
      .use(html)
      .process(data.body || "")
  ).toString();
  return {
    props: {
      contents,
      featured: data["Featured"].url,
      title: data.Title,
      subtitle: data.subtitle,
    },
  };
}

export default Home;
