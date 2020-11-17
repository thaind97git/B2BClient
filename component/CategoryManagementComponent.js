import {
  Col,
  Divider,
  Row,
  Typography,
  List,
  Space,
  Button,
  Skeleton
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  childCategoryDataSelector,
  getChildCategory,
  getChildCategoryResetter,
  getParentCategory,
  getParentCategoryResetter,
  parentCategoryDataSelector
} from '../stores/CategoryState';

const connectToRedux = connect(
  createStructuredSelector({
    parentCategoryData: parentCategoryDataSelector,
    childCategoryData: childCategoryDataSelector
  }),
  (dispatch) => ({
    getParentCategory: (parentId) => dispatch(getParentCategory(parentId)),
    getChildCategory: (id) => dispatch(getChildCategory(id)),
    resetParent: () => dispatch(getParentCategoryResetter),
    resetChild: () => dispatch(getChildCategoryResetter)
  })
);
const CategoryManagementComponent = ({
  parentCategoryData,
  getParentCategory,
  resetChild,
  resetParent,
  getChildCategory,
  childCategoryData
}) => {
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const [currentCategorySelected, setCurrentCategorySelected] = useState({
    description: 'Root Category'
  });
  const [isGetChild, setIsGetChild] = useState(false);
  const [listCategorySelected, setListCategorySelected] = useState([]);
  const [currentChildId, setCurrentChildId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isGetChild) {
      getParentCategory(currentChildId);
    }
  }, [getParentCategory, isGetChild, currentChildId]);

  useEffect(() => {
    if (isGetChild && (currentCategorySelected || {}).id) {
      getChildCategory(currentCategorySelected.id);
    }
  }, [getChildCategory, isGetChild, currentCategorySelected]);

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
      setCurrentChildId((childCategoryData[0] || {}).id);
    }
  }, [childCategoryData]);

  useEffect(() => {
    if (isGetChild) {
      resetParent();
    } else {
      resetChild();
    }
  }, [isGetChild, resetChild, resetParent]);

  useEffect(() => {
    if (listCategorySelected.length === 0) {
      setCurrentChildId(null);
      setCurrentCategorySelected({
        description: 'Root Category'
      });
    } else {
      setCurrentCategorySelected(
        listCategorySelected[listCategorySelected.length - 1]
      );
    }
  }, [listCategorySelected]);

  return (
    <div>
      <Row justify="center" align="middle">
        <Col span={20}>
          <Divider orientation="left">
            {(currentCategorySelected || {}).description}
          </Divider>
          <List
            size="large"
            header={
              listCategorySelected &&
              listCategorySelected.length > 0 && (
                <Button
                  onClick={() => {
                    setLoading(true);
                    setIsGetChild(false);
                    setListCategorySelected((prev) => {
                      const tmp = [...prev];
                      tmp.pop();
                      return tmp;
                    });
                  }}
                >
                  <LeftOutlined />
                  Back
                </Button>
              )
            }
            footer={
              <div>
                <Button type="primary">Add new category</Button>
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
                    !item.isItem && (
                      <Button
                        type="link"
                        onClick={() => {
                          console.log({ item });
                          setLoading(true);
                          setIsGetChild(true);
                          setCurrentCategorySelected(item);
                          setListCategorySelected((prev) => {
                            const tmp = [...prev];
                            tmp.push(item);
                            return tmp;
                          });
                        }}
                      >
                        View child
                      </Button>
                    )
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
