import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import localFont from 'next/font/local'
import {useEffect} from "react";

const myFont = localFont({ src: "../misc/Web437_IBM_VGA_8x14.woff" })

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);
  return (
      <main className={myFont.className}>
          <Component {...pageProps} />
      </main>
  );
}
