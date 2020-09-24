// import "../styles/globals.css";
import "../styles/antd-custom.less";
import "../styles/index.ant.less";
import App from "next/app";
import { wrapper } from "../stores/store";
import dynamic from "next/dynamic";

const TopProgressBar = dynamic(
  () => {
    return import("../component/TopProgressBar");
  },
  { ssr: false }
);
class B2BMarket extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <TopProgressBar />
        <Component {...pageProps} />
      </>
    );
  }
}

export default wrapper.withRedux(B2BMarket);
