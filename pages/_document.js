import Document, { Head, Main, NextScript, Html } from "next/document";
import React from "react";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    const rootProps = this.props;

    return (
      <Html>
        <Head>
          {/* <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="B2BMarket" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="#466bde"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="QR Scanner" />
          <meta name="msapplication-TileColor" content="#466bde" /> */}

          <link
            rel="stylesheet"
            type="text/css"
            href="/static/assets/custom.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/assets/nprogress.css"
          />
        </Head>
        <body className="">
          <Main {...rootProps} />
          <NextScript />
          {/* <script src="/static/customs/sc-common.js" /> */}
        </body>
      </Html>
    );
  }
}
