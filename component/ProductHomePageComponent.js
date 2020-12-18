import React, { useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import Router from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getProductSuggest,
  GetProductSuggestData,
  GetProductSuggestError
} from '../stores/ProductState';
import {
  getDefaultProductImage,
  getNounQuantity,
  getProductImage
} from '../utils';

import { GetCategoriesDataSelector } from '../stores/CategoryState';
const connectToRedux = connect(
  createStructuredSelector({
    getProductSuggestData: GetProductSuggestData,
    getProductSuggestError: GetProductSuggestError,
    categoryData: GetCategoriesDataSelector
  }),
  (dispatch) => ({
    getProductSuggest: (pageIndex, pageSize) =>
      dispatch(getProductSuggest({ pageIndex, pageSize }))
  })
);

const pageSize = 12;
const getCategoryItem = (categories = []) => {
  return categories.map((category) => {
    return (
      <li className={category?.subCategories ? 'has-submenu' : ''}>
        <a href={`/home-category?categoryId=${category.id}`}>
          {category.description}
        </a>
        {category?.subCategories && (
          <ul className="submenu">
            {getCategoryItem(category?.subCategories)}
          </ul>
        )}
      </li>
    );
  });
};
const pageIndex = 1;
const ProductListHomePageComponent = ({
  getProductSuggest,
  getProductSuggestData,
  categoryData
}) => {
  useEffect(() => {
    getProductSuggest(pageIndex, pageSize);
  }, [getProductSuggest]);

  let productData = [];
  if (getProductSuggestData) {
    productData = getProductSuggestData.data;
  }

  return (
    <div>
      <section className="section-main padding-y">
        <main className="card">
          <div className="card-body">
            <div className="row">
              <aside className="col-lg col-md-3 flex-lg-grow-0">
                <nav className="nav-home-aside">
                  <h6 className="title-category">
                    MY MARKETS{' '}
                    <i className="d-md-none icon fa fa-chevron-down"></i>
                  </h6>
                  <ul className="menu-category">
                    {getCategoryItem(categoryData || [])}
                  </ul>
                </nav>
              </aside>
              <div className="col-md-9 col-xl-9 col-lg-9">
                <div
                  id="carousel1_indicator"
                  className="slider-home-banner carousel slide"
                  data-ride="carousel"
                >
                  <ol className="carousel-indicators">
                    <li
                      data-target="#carousel1_indicator"
                      data-slide-to="0"
                      className="active"
                    ></li>
                    <li
                      data-target="#carousel1_indicator"
                      data-slide-to="1"
                    ></li>
                    <li
                      data-target="#carousel1_indicator"
                      data-slide-to="2"
                    ></li>
                  </ol>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img
                        src="/static/homepage/images/banners/slide1.png"
                        alt="First slide"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="/static/homepage/images/banners/slide2.jpg"
                        alt="Second slide"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="/static/homepage/images/banners/slide3.jpg"
                        alt="Third slide"
                      />
                    </div>
                  </div>
                  <a
                    className="carousel-control-prev"
                    href="#carousel1_indicator"
                    role="button"
                    data-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a
                    className="carousel-control-next"
                    href="#carousel1_indicator"
                    role="button"
                    data-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Next</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      <section className="padding-bottom-sm">
        <header className="section-heading heading-line">
          <h4
            className="title-section text-uppercase"
            style={{ background: '#f0f2f5' }}
          >
            Recommend Items
          </h4>
        </header>

        <div className="row row-sm">
          {productData?.map((product) => {
            return (
              <div className="col-xl-3 col-lg-3 col-md-4 col-6">
                <div className="card card-sm card-product-grid">
                  <a
                    href={`/product-details?id=${product.id}`}
                    className="img-wrap"
                  >
                    {product.orderingQuantity > 0 && (
                      <span className="badge badge-danger"> HOT </span>
                    )}
                    <img
                      aria-hidden
                      alt="product-image"
                      src={getProductImage(
                        !!product.images && product.images.length > 0
                          ? product.images[0]
                          : getDefaultProductImage()
                      )}
                    />
                  </a>
                  <figcaption className="info-wrap">
                    <a
                      href={`/product-details?id=${product.id}`}
                      className="title"
                    >
                      {product.productName}
                    </a>
                    <div
                      style={{ margin: '8px 0px' }}
                      className="d-flex justify-content-between"
                    >
                      <div className="price mt-1">
                        {product?.orderingRFQ ? (
                          <Tooltip title="Ordering RFQs">
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <img
                                src="/static/images/grouping.png"
                                alt="ordering"
                                width={18}
                              />
                              <span>{`${
                                product.orderingQuantity
                              } ${getNounQuantity(
                                product?.orderingQuantity,
                                product?.unitOfMeasure?.description
                              )}`}</span>
                            </div>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Recommend for you">
                            <img
                              src="/static/images/recommend.png"
                              alt="ordering"
                              width={24}
                            />
                          </Tooltip>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          Router.push(
                            `/buyer/rfq/create?productId=${product.id}`
                          );
                        }}
                        size="small"
                        type="primary"
                      >
                        Submit RFQ
                      </Button>
                    </div>
                  </figcaption>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <article className="my-4">
        <img
          src="/static/homepage/images/banners/ad-sm.png"
          alt=""
          className="w-100"
        />
      </article>
    </div>
  );
};

export default connectToRedux(ProductListHomePageComponent);
