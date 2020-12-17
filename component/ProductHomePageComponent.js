import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import Router from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getProductByCategory,
  GetProductByCategoryData,
  GetProductByCategoryError,
  getProductSuggest,
  GetProductSuggestData,
  GetProductSuggestError
} from '../stores/ProductState';
import { getDefaultProductImage, getProductImage } from '../utils';
import {
  checkDuplicate,
  CheckDuplicateData,
  CheckDuplicateResetter
} from '../stores/RequestState';
import {
  getCategories,
  GetCategoriesDataSelector
} from '../stores/CategoryState';

const connectToRedux = connect(
  createStructuredSelector({
    getProductByCategoryData: GetProductByCategoryData,
    getProductByCategoryError: GetProductByCategoryError,
    getProductSuggestData: GetProductSuggestData,
    getProductSuggestError: GetProductSuggestError,
    duplicateData: CheckDuplicateData,
    categoryData: GetCategoriesDataSelector
  }),
  (dispatch) => ({
    getProductByCategory: (id, pageSize, pageIndex, name) =>
      dispatch(getProductByCategory(id, pageSize, pageIndex, name)),
    getProductSuggest: (pageIndex, pageSize) =>
      dispatch(getProductSuggest({ pageIndex, pageSize })),
    checkDuplicateRFQ: (productId) => dispatch(checkDuplicate(productId)),
    resetCheckDuplicate: () => dispatch(CheckDuplicateResetter),
    getCategories: () => dispatch(getCategories())
  })
);

const pageSize = 12;
const getCategoryItem = (categories = []) => {
  return categories.map((category) => {
    return (
      <li
        onClick={() => {
          Router.push(`/home-category?id=${category.id}`);
        }}
        className={category?.subCategories ? 'has-submenu' : ''}
      >
        <a href="#">{category.description}</a>
        {category?.subCategories && (
          <ul className="submenu">
            {getCategoryItem(category?.subCategories)}
          </ul>
        )}
      </li>
    );
  });
};
const ProductListHomePageComponent = ({
  getProductByCategory,
  getProductByCategoryData,
  getProductByCategoryError,
  getProductSuggest,
  getProductSuggestError,
  getProductSuggestData,
  categoryData
}) => {
  const [currentCategorySelected, setCurrentCategorySelected] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isLoadSuggest, setIsLoadSuggest] = useState(true);

  useEffect(() => {
    if (isLoadSuggest) {
      getProductSuggest(pageIndex, pageSize);
    }
  }, [isLoadSuggest, pageIndex, getProductSuggest]);

  useEffect(() => {
    if (
      (currentCategorySelected || {}).id &&
      (currentCategorySelected || {}).id !== 'all' &&
      isCategorySelected
    ) {
      getProductByCategory(
        (currentCategorySelected || {}).id,
        pageSize,
        pageIndex
      );
      setLoading(true);
    }
  }, [
    pageIndex,
    currentCategorySelected,
    getProductByCategory,
    isCategorySelected
  ]);

  useEffect(() => {
    setPageIndex(1);
  }, [currentCategorySelected]);

  useEffect(() => {
    if (
      getProductByCategoryError ||
      getProductByCategoryData ||
      getProductSuggestData ||
      getProductSuggestError
    ) {
      setLoading(false);
    }
  }, [
    getProductByCategoryData,
    getProductByCategoryError,
    getProductSuggestData,
    getProductSuggestError
  ]);

  let productData = [];
  if (isLoadSuggest) {
    if (getProductSuggestData) {
      productData = getProductSuggestData.data;
    }
  } else {
    if (!!getProductByCategoryData) {
      productData = getProductByCategoryData.data;
    }
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
          <h4 className="title-section text-uppercase">Recommended items</h4>
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
                        {product.orderingRFQ ? (
                          <Tooltip title="Ordering RFQs">
                            {`${product.orderingRFQ} ${product?.unitOfMeasure?.description}` ||
                              'New'}
                          </Tooltip>
                        ) : (
                          <span className="badge badge-danger"> NEW </span>
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
