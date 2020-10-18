import React, { Fragment, useEffect, useState } from "react";
import { Row, List, Space, Input } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  childCategoryDataSelector,
  getChildCategory,
  getParentCategory,
  parentCategoryDataSelector,
  parentCategoryErrorSelector,
} from "../stores/CategoryState";
import { compose } from "redux";
import {
  ADD_CATEGORY_SELECTED,
  SET_CATEGORY_SELECTED,
} from "../stores/initState";

const connectToRedux = connect(
  createStructuredSelector({
    parentCateData: parentCategoryDataSelector,
    parentCateError: parentCategoryErrorSelector,
    childCateData: childCategoryDataSelector,
    categorySelected: (state) => state.categorySelected,
  }),
  (dispatch) => ({
    getParentCategory: (childId) => dispatch(getParentCategory(childId)),
    getChildCategory: (parentId) => dispatch(getChildCategory(parentId)),
    addCategorySelected: (categoryObj) =>
      dispatch({ type: ADD_CATEGORY_SELECTED, payload: categoryObj }),
    setCategorySelected: (newCategorySelected) =>
      dispatch({ type: SET_CATEGORY_SELECTED, payload: newCategorySelected }),
  })
);

const enhance = compose(connectToRedux);

const handleCallCategoryAPI = ({
  isCallParent,
  currentIdSelected,
  getParentCategory,
  getChildCategory,
  currentChildId,
}) => {
  if (isCallParent === null) {
    return;
  } else if (isCallParent && currentChildId) {
    getParentCategory(currentChildId);
  } else if (!isCallParent && currentIdSelected) {
    getChildCategory(currentIdSelected);
  }
};

const BuyerRequestCategoryComponent = ({
  getParentCategory,
  getChildCategory,
  parentCateData,
  childCateData,
  doneFunc,
  categorySelected,
  addCategorySelected,
  setCategorySelected,
}) => {
  const [firstCallParent, setFirstCallParent] = useState(true);
  const [currentIdSelected, setCurrentIdSelected] = useState(null);
  const [currentChildId, setCurrentChildId] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [isCallParent, setIsCallParent] = useState(true);

  useEffect(() => {
    if (categorySelected && categorySelected.length > 0) {
      const lastCategorySelected =
        categorySelected[categorySelected.length - 1];
      if (!!lastCategorySelected) {
        getChildCategory(lastCategorySelected.id);
      }
    } else if (firstCallParent) {
      console.log("1");
      getParentCategory();
      setFirstCallParent(false);
    }
  }, [firstCallParent, getParentCategory, categorySelected, getChildCategory]);

  useEffect(() => {
    handleCallCategoryAPI({
      getParentCategory,
      isCallParent,
      currentIdSelected,
      getChildCategory,
      currentChildId,
    });
  }, [
    getParentCategory,
    isCallParent,
    currentIdSelected,
    getChildCategory,
    currentChildId,
  ]);

  useEffect(() => {
    if (parentCateData) {
      setCategoryData(parentCateData);
    } else if (childCateData) {
      setCategoryData(childCateData);
    }
  }, [parentCateData, childCateData]);

  return (
    <Fragment>
      <Row style={{ width: "100%", margin: "24px 16px" }}>
        <Input.Search
          style={{ width: "100%", marginBottom: 12 }}
          placeholder="Search by category name"
        />
        <List
          style={{ width: "100%" }}
          header={
            !!categorySelected.length ? (
              <Space
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const firstChildCategory = (categoryData || [])[0];
                  if (firstChildCategory) {
                    setCurrentChildId(firstChildCategory.id);
                    setIsCallParent(true);
                  }
                  (categorySelected || []).pop();
                  setCategorySelected(categorySelected);
                }}
              >
                <LeftOutlined />
                Back
              </Space>
            ) : (
              false
            )
          }
          bordered
          dataSource={categoryData}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                if (item.isItem) {
                  typeof doneFunc === "function" && doneFunc();
                  setIsCallParent(null);
                } else {
                  setIsCallParent(false);
                }
                setCurrentIdSelected(item.id);
                addCategorySelected(item);
              }}
              className={clsx("list-item", !item.isItem ? "item" : "")}
              style={{
                cursor: "pointer",
              }}
            >
              <Row justify="space-between" style={{ width: "100%" }}>
                <b>{item.description}</b>
                <div>{!item.isItem ? <RightOutlined /> : null}</div>
              </Row>
            </List.Item>
          )}
        />
      </Row>
      <style jsx global>
        {`
          .list-item.item:hover {
            background: #f5f5f5;
            transition: all 0.3s;
          }
        `}
      </style>
    </Fragment>
  );
};

export default enhance(BuyerRequestCategoryComponent);
