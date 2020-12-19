import { Col, Divider, Row, List, Button, Skeleton, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  childCategoryDataSelector,
  childCategoryErrorSelector,
  CreateCategoryData,
  getCategoryById,
  GetCategoryByIdDataSelector,
  getChildCategory,
  getChildCategoryResetter,
  getParentCategory,
  getParentCategoryResetter,
  parentCategoryDataSelector,
  parentCategoryErrorSelector
} from '../stores/CategoryState';
import AllCategoryComponent from './AllCategoryComponent';
import CategoryUpdateComponent from './CategoryUpdateComponent';
import CategoryAddNewComponent from './CategoryAddNewComponent';

const connectToRedux = connect(
  createStructuredSelector({
    parentCategoryData: parentCategoryDataSelector,
    childCategoryData: childCategoryDataSelector,
    createCategoryData: CreateCategoryData,
    parentCategoryError: parentCategoryErrorSelector,
    childCategoryError: childCategoryErrorSelector,
    categoryDetails: GetCategoryByIdDataSelector
  }),
  (dispatch) => ({
    getParentCategory: (parentId) => dispatch(getParentCategory(parentId)),
    getChildCategory: (id) => dispatch(getChildCategory(id)),
    resetParent: () => dispatch(getParentCategoryResetter),
    resetChild: () => dispatch(getChildCategoryResetter),
    getCategoryById: (id) => dispatch(getCategoryById(id))
  })
);
const CategoryManagementComponent = ({
  parentCategoryData,
  getParentCategory,
  resetChild,
  getChildCategory,
  childCategoryData,
  parentCategoryError,
  childCategoryError
}) => {
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryLabel, setCategoryLabel] = useState('Root Category');
  const [categoryLastLabel, setCategoryLastLabel] = useState('Root Category');

  const [categoryIdUpdate, setCategoryIdUpdate] = useState(null);
  useEffect(() => {
    if (firstTime) {
      getParentCategory();
      setFirstTime(false);
    }
  }, [getParentCategory, firstTime]);

  useEffect(() => {
    if (parentCategoryData) {
      setLoading(false);
      setCurrentCategoryData(parentCategoryData);
    }
  }, [parentCategoryData]);

  useEffect(() => {
    if (childCategoryData) {
      setLoading(false);
      setCurrentCategoryData(childCategoryData);
    }
  }, [childCategoryData]);

  useEffect(() => {
    if (childCategoryError || parentCategoryError) {
      setLoading(false);
    }
  }, [childCategoryError, parentCategoryError]);

  useEffect(() => {
    if (categoryId === 'all') {
      getParentCategory();
    } else if (categoryId) {
      getChildCategory(categoryId);
    }
  }, [getChildCategory, categoryId, getParentCategory]);

  return (
    <div>
      <Modal
        title={`Create new category inside ${
          categoryLastLabel || 'Root Category'
        }`}
        visible={openCreate}
        footer={false}
      >
        {openCreate ? (
          <CategoryAddNewComponent
            setOpenAdd={setOpenCreate}
            onCallbackSuccess={() => {
              if (categoryId) {
                getChildCategory(categoryId);
              } else {
                getParentCategory();
              }
            }}
            parentCategoryId={categoryId}
          />
        ) : null}
      </Modal>
      <Modal footer={false} title={`Update category`} visible={openUpdate}>
        {openUpdate ? (
          <CategoryUpdateComponent
            onCallbackSuccess={() => {
              if (categoryId) {
                getChildCategory(categoryId);
              } else {
                getParentCategory();
              }
            }}
            setOpenDetails={setOpenUpdate}
            categoryId={categoryIdUpdate}
          />
        ) : null}
      </Modal>
      <Row justify="center" align="middle">
        <Col span={14}>
          <AllCategoryComponent
            changeOnSelect
            expandTrigger="hover"
            defaultLabel="Root Category"
            style={{ width: '100%' }}
            onGetLastValue={(value) => {
              resetChild();
              setCategoryId(value);
            }}
            onGetLabel={(value) => setCategoryLabel(value)}
            onGetLastLabel={(value) => setCategoryLastLabel(value)}
            size="large"
            isSearchStyle={false}
          />
        </Col>
        <Col span={20}>
          <Divider orientation="center">
            {categoryLabel || 'Root Category'}
          </Divider>
          <List
            size="large"
            footer={
              <div>
                <Button onClick={() => setOpenCreate(true)} type="primary">
                  Add new category
                </Button>
              </div>
            }
            bordered
            dataSource={currentCategoryData || []}
            renderItem={(item = {}) =>
              loading ? (
                <div style={{ height: 400 }}>
                  <Skeleton active />
                </div>
              ) : (
                <List.Item
                  key={item.id}
                  actions={[
                    <Button
                      type="link"
                      onClick={() => {
                        setOpenUpdate(true);
                        setCategoryIdUpdate(item.id);
                      }}
                    >
                      Update
                    </Button>
                  ]}
                >
                  {item.description}
                </List.Item>
              )
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default connectToRedux(CategoryManagementComponent);
