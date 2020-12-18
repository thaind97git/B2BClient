import { Dropdown, Menu } from 'antd';
import {
  UnorderedListOutlined,
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  LoginOutlined,
  FormOutlined
} from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { BUYER, MODERATOR, SUPPLIER } from '../enums/accountRoles';
import { removeToken } from '../libs/localStorage';
import {
  getCategories,
  GetCategoriesDataSelector
} from '../stores/CategoryState';
import {
  CurrentUserData,
  CurrentUserResetter,
  getCurrentUser
} from '../stores/UserState';
import Router from 'next/router';
import { doFunctionWithEnter } from '../utils';
import Head from 'next/head';
const { SubMenu } = Menu;
const connectToRedux = connect(
  createStructuredSelector({
    currentUserData: CurrentUserData,
    categoryData: GetCategoriesDataSelector
  }),
  (dispatch) => ({
    getCurrentUser: () => dispatch(getCurrentUser({ isVerify: false })),
    resetData: () => dispatch(CurrentUserResetter),
    getCategories: () => dispatch(getCategories())
  })
);
const getCategoryItem = (categories = []) => {
  return categories.map((category) => {
    return category?.subCategories ? (
      <SubMenu
        onTitleClick={() => {
          Router.push(`/home-category?categoryId=${category.id}`);
        }}
        key={category.id}
        title={category.description}
      >
        {getCategoryItem(category?.subCategories)}
      </SubMenu>
    ) : (
      <Menu.Item
        onClick={() => {
          Router.push(`/home-category?categoryId=${category.id}`);
        }}
        key={category.id}
      >
        {category.description}
      </Menu.Item>
    );
  });
};
const HomePageLayout = ({
  children,
  currentUserData,
  getCurrentUser,
  resetData,
  getCategories,
  categoryData,
  isCategory = false
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  useEffect(() => {
    getCategories();
  }, [getCategories]);
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    if (
      currentUserData &&
      (currentUserData.role === SUPPLIER ||
        currentUserData.role === BUYER ||
        currentUserData.role === MODERATOR)
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUserData]);

  let url = '';
  if (currentUserData) {
    if (currentUserData.role === BUYER) {
      url = '/buyer/user-profile';
    }
    if (currentUserData.role === SUPPLIER) {
      url = '/supplier';
    }
    if (currentUserData.role === MODERATOR) {
      url = '/aggregator';
    }
  }
  return (
    <Fragment>
      <Head>
        <title>Negotium</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <link
        href="/static/homepage/images/favicon.ico"
        rel="shortcut icon"
        type="image/x-icon"
      />

      <script
        src="/static/homepage/js/jquery-2.0.0.min.js"
        type="text/javascript"
      ></script>

      <script
        src="/static/homepage/js/bootstrap.bundle.min.js"
        type="text/javascript"
      ></script>
      <link
        href="/static/homepage/css/bootstrap3661.css?v=2.0"
        rel="stylesheet"
        type="text/css"
      />

      <link
        href="/static/homepage/fonts/fontawesome/css/all.min3661.css?v=2.0"
        type="text/css"
        rel="stylesheet"
      />

      <link
        href="/static/homepage/css/ui3661.css?v=2.0"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="/static/homepage/css/responsive3661.css?v=2.0"
        rel="stylesheet"
        type="text/css"
      />

      <script
        src="/static/homepage/js/script3661.js?v=2.0"
        type="text/javascript"
      ></script>

      <header className="section-header">
        <section className="header-main border-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3 col-md-12">
                <a href="/" className="brand-wrap">
                  <img
                    alt="Negotium"
                    className="logo"
                    src="/static/images/logo.png"
                  />
                </a>
              </div>
              <div className="col-1">
                {isCategory && (
                  <Dropdown
                    overlay={<Menu>{getCategoryItem(categoryData || [])}</Menu>}
                  >
                    <a
                      className="ant-dropdown-link d-flex flex-direction-row align-items-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      <UnorderedListOutlined />
                      <span>&nbsp;</span> Categories<span>&nbsp;</span>
                      <DownOutlined />
                      <span>&nbsp;&nbsp;</span>
                    </a>
                  </Dropdown>
                )}
              </div>
              <div className="col-xl-7 col-lg-7 col-md-8">
                <div className="search-header">
                  <div className="input-group w-100">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchMessage}
                      onChange={(event) => setSearchMessage(event.target.value)}
                      onKeyPress={(event) => {
                        doFunctionWithEnter(event, () =>
                          Router.push(`/home-category?q=${searchMessage}`)
                        );
                      }}
                    />

                    <div className="input-group-append">
                      <button
                        onClick={() => {
                          Router.push(`/home-category?q=${searchMessage}`);
                        }}
                        className="btn btn-primary"
                        type="submit"
                      >
                        <i className="fa fa-search"></i> Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-4">
                <div className="widgets-wrap float-md-right">
                  {isAuthenticated ? (
                    <Fragment>
                      <div className="widget-header mr-3">
                        <a href={url} className="widget-view ">
                          <div className="icon-area">
                            <UserOutlined style={{ fontSize: 18 }} />
                          </div>
                          <small className="text" style={{ marginTop: 5 }}>
                            Hi, {(currentUserData || {}).lastName}
                          </small>
                        </a>
                      </div>
                      <div className="widget-header mr-3">
                        <a
                          href="/login"
                          onClick={() => removeToken()}
                          className="widget-view "
                        >
                          <div className="icon-area">
                            <LogoutOutlined style={{ fontSize: 18 }} />
                          </div>
                          <small className="text" style={{ marginTop: 5 }}>
                            Logout
                          </small>
                        </a>
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="widget-header mr-3">
                        <a href="/login" className="widget-view ">
                          <div className="icon-area">
                            <LoginOutlined style={{ fontSize: 18 }} />
                          </div>
                          <small className="text" style={{ marginTop: 5 }}>
                            Login
                          </small>
                        </a>
                      </div>
                      <div className="widget-header mr-3">
                        <a href="/register" className="widget-view ">
                          <div className="icon-area">
                            <FormOutlined style={{ fontSize: 18 }} />
                          </div>
                          <small className="text" style={{ marginTop: 5 }}>
                            Register
                          </small>
                        </a>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <div className="container">{children}</div>
      <footer className="section-footer bg-secondary">
        <div className="container">
          <section className="footer-top padding-y-lg text-white">
            <div className="row">
              <aside className="col-md col-6">
                <h6 className="title" style={{ color: 'white' }}>
                  Brands
                </h6>
                <ul className="list-unstyled">
                  <li>
                    {' '}
                    <a href="#">Adidas</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Puma</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Reebok</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Nike</a>
                  </li>
                </ul>
              </aside>
              <aside className="col-md col-6">
                <h6 className="title" style={{ color: 'white' }}>
                  Company
                </h6>
                <ul className="list-unstyled">
                  <li>
                    {' '}
                    <a href="#">About us</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Career</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Find a store</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Rules and terms</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Sitemap</a>
                  </li>
                </ul>
              </aside>
              <aside className="col-md col-6">
                <h6 className="title" style={{ color: 'white' }}>
                  Help
                </h6>
                <ul className="list-unstyled">
                  <li>
                    {' '}
                    <a href="#">Contact us</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Money refund</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Order status</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Shipping info</a>
                  </li>
                  <li>
                    {' '}
                    <a href="#">Open dispute</a>
                  </li>
                </ul>
              </aside>
              <aside className="col-md col-6">
                <h6 className="title" style={{ color: 'white' }}>
                  Account
                </h6>
                <ul className="list-unstyled">
                  <li>
                    {' '}
                    <a href="#"> User Login </a>
                  </li>
                  <li>
                    {' '}
                    <a href="#"> User register </a>
                  </li>
                  <li>
                    {' '}
                    <a href="#"> Account Setting </a>
                  </li>
                  <li>
                    {' '}
                    <a href="#"> My Orders </a>
                  </li>
                </ul>
              </aside>
              <aside className="col-md">
                <h6 className="title" style={{ color: 'white' }}>
                  Social
                </h6>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">
                      {' '}
                      <i className="fab fa-facebook"></i> Facebook{' '}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      {' '}
                      <i className="fab fa-twitter"></i> Twitter{' '}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      {' '}
                      <i className="fab fa-instagram"></i> Instagram{' '}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      {' '}
                      <i className="fab fa-youtube"></i> Youtube{' '}
                    </a>
                  </li>
                </ul>
              </aside>
            </div>
          </section>

          <section className="footer-bottom text-center">
            <p className="text-white">
              &copy 2020 B2B Negotium, All rights reserved
            </p>
            <br />
          </section>
        </div>
      </footer>
    </Fragment>
  );
};

export default connectToRedux(HomePageLayout);
