import {
  Col,
  Divider,
  Row,
  Typography,
  List,
  Space,
  Button,
  Skeleton,
  Modal,
  Input,
  Checkbox
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  childCategoryDataSelector,
  childCategoryErrorSelector,
  createCategory,
  CreateCategoryData,
  getCategoryById,
  GetCategoryByIdDataSelector,
  GetCategoryByIdResetter,
  getChildCategory,
  getChildCategoryResetter,
  getParentCategory,
  getParentCategoryResetter,
  parentCategoryDataSelector,
  parentCategoryErrorSelector
} from '../stores/CategoryState';
import { openNotification } from '../utils';
import AllCategoryComponent from './AllCategoryComponent';
import { get } from 'lodash/fp';

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
    createCategory: ({ name, parentId, isItem }, callback) =>
      dispatch(
        createCategory(
          {
            description: name,
            parentCategoryId: parentId,
            isItem
          },
          callback
        )
      ),
    getCategoryById: (id) => dispatch(getCategoryById(id)),
    resetDetails: () => dispatch(GetCategoryByIdResetter)
  })
);
const CategoryManagementComponent = ({
  parentCategoryData,
  getParentCategory,
  resetChild,
  resetParent,
  getChildCategory,
  childCategoryData,
  createCategory,
  createCategoryData,
  parentCategoryError,
  childCategoryError,
  categoryDetails,
  getCategoryById,
  resetDetails
}) => {
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [category, setCategory] = useState('');
  const [isItem, setIsItem] = useState(false);
  const [categoryUpdate, setCategoryUpdate] = useState(
    get('[0].description')(categoryDetails)
  );
  const [isItemUpdate, setIsItemUpdate] = useState(
    get('[0].isItem')(categoryDetails)
  );

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
    if (createCategoryData) {
      setOpenCreate(false);
      setCategory('');
      setIsItem(false);
    }
  }, [createCategoryData]);

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

  useEffect(() => {
    if (categoryIdUpdate) {
      getCategoryById(categoryIdUpdate);
    }
  }, [categoryIdUpdate, getCategoryById]);
  useEffect(() => {
    console.log({
      categoryDetails,
      x: get('[0].description')(categoryDetails),
      y: get('[0].isItem')(categoryDetails)
    });
  }, [categoryDetails]);

  useEffect(() => {
    if (!openUpdate) {
      resetDetails();
      setCategoryUpdate('');
      setIsItemUpdate(false);
    }
  }, [openUpdate, resetDetails]);

  return (
    <div>
      <Modal
        title={`Create new category inside ${
          categoryLastLabel || 'Root Category'
        }`}
        visible={openCreate}
        onOk={() => {
          if (!category) {
            openNotification('error', {
              message: 'Please input the category name'
            });
            return;
          }
          createCategory(
            {
              name: category,
              parentId: categoryId,
              isItem
            },
            () => {
              if (categoryId) {
                getChildCategory(categoryId);
              } else {
                getParentCategory();
              }
            }
          );
        }}
        onCancel={() => {
          setOpenCreate(false);
        }}
      >
        <Input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Enter the category name"
        />
        <Checkbox
          checked={isItem}
          style={{ marginTop: 24 }}
          onChange={(e) => {
            setIsItem(e.target.checked);
          }}
        >
          Is last category
        </Checkbox>
      </Modal>
      <Modal
        title={`Update category`}
        visible={openUpdate}
        onOk={() => {
          if (!category) {
            openNotification('error', {
              message: 'Please input the category name'
            });
            return;
          }
          console.log(categoryUpdate);
          // createCategory(
          //   {
          //     name: category,
          //     parentId: categoryId,
          //     isItem
          //   },
          //   () => {
          //     if (categoryId) {
          //       getChildCategory(categoryId);
          //     } else {
          //       getParentCategory();
          //     }
          //   }
          // );
        }}
        onCancel={() => {
          setOpenUpdate(false);
        }}
      >
        {openUpdate && categoryDetails ? (
          <Fragment>
            <Input
              defaultValue={get('[0].description')(categoryDetails)}
              value={categoryUpdate}
              onChange={(event) => setCategoryUpdate(event.target.value)}
              placeholder="Enter the category name"
            />
            <Checkbox
              defaultChecked={get('[0].isItem')(categoryDetails)}
              // checked={isItem}
              style={{ marginTop: 24 }}
              onChange={(e) => {
                setIsItemUpdate(e.target.checked);
              }}
            >
              Is last category
            </Checkbox>
          </Fragment>
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
              // resetParent();
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
