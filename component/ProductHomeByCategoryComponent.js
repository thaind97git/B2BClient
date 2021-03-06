import React, { Fragment, useEffect, useState } from 'react';
import { Breadcrumb, Button, Empty, Pagination, Tooltip } from 'antd';
import Router, { useRouter } from 'next/router';
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
import { getNounQuantity, getProductImage } from '../utils';
import {
  checkDuplicate,
  CheckDuplicateData,
  CheckDuplicateResetter
} from '../stores/RequestState';
import {
  getCategories,
  GetCategoriesDataSelector,
  getRootCategoryById,
  GetRootCategoryByIdDataSelector
} from '../stores/CategoryState';
const connectToRedux = connect(
  createStructuredSelector({
    getProductByCategoryData: GetProductByCategoryData,
    getProductByCategoryError: GetProductByCategoryError,
    getProductSuggestData: GetProductSuggestData,
    getProductSuggestError: GetProductSuggestError,
    duplicateData: CheckDuplicateData,
    categoryData: GetCategoriesDataSelector,
    rootCategoryData: GetRootCategoryByIdDataSelector
  }),
  (dispatch) => ({
    getProductByCategory: (id, pageSize, pageIndex, name) =>
      dispatch(getProductByCategory(id, pageSize, pageIndex, name)),
    getProductSuggest: (pageIndex, pageSize) =>
      dispatch(getProductSuggest({ pageIndex, pageSize })),
    checkDuplicateRFQ: (productId) => dispatch(checkDuplicate(productId)),
    resetCheckDuplicate: () => dispatch(CheckDuplicateResetter),
    getCategories: () => dispatch(getCategories()),
    getRootCategoryById: (id) => dispatch(getRootCategoryById(id))
  })
);

const pageSize = 12;
const renderBreadcrumb = (categories = []) => {
  return !!categories
    ? [categories]?.map((category) => {
        return (
          <span key={category.id}>
            <Breadcrumb.Item key={category.id}>
              <a href={`/home-category?categoryId=${category.id}`}>
                {category.description}
              </a>
            </Breadcrumb.Item>{' '}
            {category?.subCategory && renderBreadcrumb(category?.subCategory)}
          </span>
        );
      })
    : null;
};
const ProductHomeByCategoryComponent = ({
  getProductByCategory,
  getProductByCategoryData,
  rootCategoryData,
  getRootCategoryById
}) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { categoryId, q: querySearch } = router.query;
  useEffect(() => {
    getProductByCategory(categoryId, pageSize, pageIndex, querySearch);
    setLoading(true);
  }, [pageIndex, getProductByCategory, categoryId, querySearch]);
  useEffect(() => {
    if (categoryId) {
      getRootCategoryById(categoryId);
    }
  }, [categoryId, getRootCategoryById]);

  let productData = [],
    totalCount = 0;

  if (!!getProductByCategoryData) {
    productData = getProductByCategoryData.data;
    totalCount = getProductByCategoryData.total;
  }
  if (!productData?.length) {
    return (
      <Fragment>
        <section className="section-content padding-y">
          <div className="container">
            {categoryId && (
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <nav className="col-md-8">
                      <Breadcrumb.Item>
                        <a href="/">Home</a>
                      </Breadcrumb.Item>
                      {renderBreadcrumb(rootCategoryData)}
                    </nav>
                  </div>
                </div>
              </div>
            )}
            <header className="mb-1">
              <div className="form-inline">
                <strong className="mr-md-auto">
                  {totalCount} Items found{' '}
                </strong>
              </div>
            </header>
            <div className="card mb-3">
              <div className="card-body">
                <Empty
                  style={{ padding: '180px 0px' }}
                  description="Empty data !"
                />
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
  return (
    <div>
      <section className="section-content padding-y">
        <div className="container">
          <div className="card mb-3">
            <div className="card-body">
              {categoryId && (
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <nav className="col-md-8">
                        <Breadcrumb.Item>
                          <a href="/">Home</a>
                        </Breadcrumb.Item>
                        {renderBreadcrumb(rootCategoryData)}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              <hr />

              <header className="mb-3">
                {!!totalCount && (
                  <div className="form-inline">
                    <strong className="mr-md-auto">
                      {totalCount} Items found{' '}
                    </strong>
                  </div>
                )}
              </header>

              <div className="row">
                {productData?.map((product) => {
                  return (
                    <div key={product.id} className="col-md-3">
                      <figure className="card card-product-grid">
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            Router.push(`/product-details?id=${product.id}`);
                          }}
                          className="img-wrap"
                        >
                          <img
                            src={getProductImage(product.images[0])}
                            alt=""
                          />
                        </div>
                        <figcaption className="info-wrap">
                          <a
                            href={`/product-details?id=${product.id}`}
                            className="title mb-2"
                          >
                            {product.productName}
                          </a>
                          <div className="price-wrap">
                            <span className="price">
                              Unit: {product?.unitOfMeasure.description}
                            </span>
                            {/* <small className="text-muted">/per item</small> */}
                          </div>

                          {/* <p className="mb-2">
                            {' '}
                            2 Pieces{' '}
                            <small className="text-muted">(Min Order)</small>
                          </p> */}

                          {/* <p className="text-muted ">
                            Guangzhou Yichuang Electronic Co
                          </p> */}

                          <hr />
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
                                    <small className="text-muted">
                                      | {product.orderingRFQ} RFQ
                                      {product.orderingRFQ > 1 ? 's' : ''}
                                    </small>
                                  </div>
                                </Tooltip>
                              ) : (
                                <span className=""></span>
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
                      </figure>
                    </div>
                  );
                })}
              </div>

              <nav className="mb-4" aria-label="Page navigation sample">
                <Pagination
                  current={pageIndex}
                  onChange={(page) => {
                    setPageIndex(page);
                  }}
                  total={totalCount}
                />
              </nav>

              {/* <div className="box text-center">
                <p>Did you find what you were looking for？</p>
                <a href="#" className="btn btn-light">
                  Yes
                </a>
                <a href="#" className="btn btn-light">
                  No
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default connectToRedux(ProductHomeByCategoryComponent);
