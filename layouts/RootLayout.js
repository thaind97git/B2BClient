import { Divider, Layout, Row } from "antd";
import React from "react";
import FooterComponent from "../component/FooterComponent";
import HeaderComponent from "../component/HeaderComponent";

const { Footer } = Layout;

const RootLayout = ({ children }) => {
  return (
    <Layout>
      <Row id="header">
        <div className="container">
          <HeaderComponent />
        </div>
      </Row>
      <Row id="content">
        <div className="container">{children}</div>
      </Row>
      <div className="container">
        <Footer>
          <FooterComponent />
          <Divider />
          <Row justify="center">
            <div>©2020 Created by B2BMarket Team</div>
          </Row>
        </Footer>
      </div>
    </Layout>
  );
};

export default RootLayout;
