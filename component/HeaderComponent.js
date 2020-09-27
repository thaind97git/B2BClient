import { Button, Col, Divider, Input, Row, Typography } from "antd";
import { AreaChartOutlined, LoginOutlined } from "@ant-design/icons";
import React from "react";
import AllCategoryComponent from "./AllCategoryComponent";
import MyAccountComponent from "./MyAccountComponent";
import { connect } from "react-redux";
import { pick } from "lodash/fp";
import { getCurrentUser } from "../stores/UserState";
import Link from "next/link";
const { Search } = Input;

const connectToRedux = connect(pick(["isLogged"]), (dispatch) => ({
  getCurrentUser: () => dispatch(getCurrentUser()),
}));

const HeaderComponent = ({ isLogged }) => {
  return (
    <Row>
      <Col span={24}>
        <Row justify="space-between">
          <div>Hotline: 123456789</div>
          <div className="header-profile menu-item">
            <Row align="middle">
              <div className="item">
                <Row align="middle">
                  <LoginOutlined /> <span>&nbsp;&nbsp;</span>
                  <Link href="/login">Login</Link>
                  <span>&nbsp;</span> /<span>&nbsp;</span>{" "}
                  <Link href="/register">Register</Link>
                </Row>
              </div>
              <div className="item">
                <MyAccountComponent isLogged={isLogged} />
              </div>
            </Row>
          </div>
        </Row>
        <Divider style={{ margin: "8px 0px" }} />
      </Col>
      <Col span={24} style={{ margin: "12px 0px" }}>
        <Row align="middle">
          <img
            height={64}
            src="/static/images/logo.png"
            alt="B2BMarket"
            className="logo"
          />
          <div className="menu-main menu-item">
            <div className="item">
              <Link href="/">Buyers</Link>
            </div>
            <div className="item">
              <Link href="/">Products</Link>
            </div>
            <div className="item">
              <Link href="/">Companies</Link>
            </div>
          </div>
        </Row>
      </Col>
      <Col span={24}>
        <Row align="middle" justify="space-between">
          <Col md={18} sm={20}>
            <Row align="middle">
              <Search
                addonBefore={<AllCategoryComponent />}
                placeholder="What are you looking for..."
                enterButton="Search"
                size="large"
                onSearch={(value) => console.log(value)}
              />
            </Row>
          </Col>
          <Col md={4} sm={12}>
            <Row>
              <Button
                type="primary"
                shape="round"
                icon={<AreaChartOutlined />}
                size="large"
              >
                Request an Auction
              </Button>
            </Row>
          </Col>
        </Row>
      </Col>
      <style jsx>
        {`
          .header-profile .item {
            font-size: 13px;
            color: #888;
            display: inline-block;
            padding-left: 20px;
            margin-left: 20px;
            position: relative;
          }

          .menu-main .item {
            font-size: 16px;
            color: #888;
            display: inline-block;
            padding-left: 12px;
            margin-left: 12px;
            position: relative;
          }

          .menu-item .item:after {
            content: "";
            position: absolute;
            width: 1px;
            background-color: #888;
            height: 11px;
            transform: translateY(-50%);
            left: 0;
            top: 50%;
          }
        `}
      </style>
    </Row>
  );
};

export default connectToRedux(HeaderComponent);
