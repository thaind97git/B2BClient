import { Col, Row } from "antd";
import React from "react";
import { HomeOutlined } from "@ant-design/icons";

const FooterComponent = () => {
  return (
    <div className="footer-contact" id="contact">
      <div className="container">
        <Row>
          <Col lg={4}>
            <div className="logo">
              <a href="/">
                <img
                  height={64}
                  src="/static/images/logo.png"
                  alt="B2BMarket"
                />
              </a>
              &nbsp;&nbsp;
              {/* <a className="title" href="/">
                B2BMarket
              </a> */}
            </div>
          </Col>
          <Col lg={20} className="contact">
            <Row>
              <Col sm={24} md={6}>
                <ul>
                  <li>Customer Services</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Learning Center</li>
                </ul>
              </Col>

              <Col sm={24} md={6}>
                <ul>
                  <li>Help</li>
                  <li>See all Help</li>
                  <li>My Account</li>
                  <li>FAQs</li>
                  <li>Other Services</li>
                </ul>
              </Col>
              <Col sm={24} md={6}>
                <ul>
                  <li>Buy on B2BMarket</li>
                  <li>Buyers</li>
                  <li>Suppliers</li>
                  <li>All Categories</li>
                </ul>
              </Col>
              <Col sm={24} md={6}>
                <ul>
                  <li>About Us</li>
                  <li>About B2BMarket</li>
                  <li>Our Partners</li>
                  <li>
                    <b>
                      <HomeOutlined />
                    </b>{" "}
                    Fpt University
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FooterComponent;
