import { Button, Input, message, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getCategoryById,
  GetCategoryByIdDataSelector,
  GetCategoryByIdResetter,
  updateCategory,
  UpdateCategoryData,
  UpdateCategoryError,
  UpdateCategoryResetter
} from '../stores/CategoryState';

const connectToRedux = connect(
  createStructuredSelector({
    categoryDetails: GetCategoryByIdDataSelector,
    updateCategoryData: UpdateCategoryData,
    updateCategoryError: UpdateCategoryError
  }),
  (dispatch) => ({
    getCategoryById: (id) => dispatch(getCategoryById(id)),
    resetDetails: () => dispatch(GetCategoryByIdResetter),
    updateCategory: ({ description, id }) =>
      dispatch(updateCategory({ description, id })),
    resetUpdateCategory: () => dispatch(UpdateCategoryResetter)
  })
);
const CategoryUpdateComponent = ({
  categoryDetails,
  getCategoryById,
  resetDetails,
  categoryId,
  setOpenDetails,
  updateCategory,
  updateCategoryData,
  onCallbackSuccess,
  resetUpdateCategory
}) => {
  const [category, setCategory] = useState();
  useEffect(() => {
    return () => {
      resetDetails();
      resetUpdateCategory();
    };
  }, [resetDetails, resetUpdateCategory]);

  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId);
    }
  }, [categoryId, getCategoryById]);

  useEffect(() => {
    if (!!categoryDetails) {
      setCategory(categoryDetails?.[0]?.description);
    }
  }, [categoryDetails]);

  useEffect(() => {
    if (!!updateCategoryData) {
      setOpenDetails(false);
      typeof onCallbackSuccess === 'function' && onCallbackSuccess();
    }
  }, [updateCategoryData, setOpenDetails, onCallbackSuccess]);

  if (!categoryId) {
    return null;
  }
  return (
    <div>
      <Input
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        placeholder="Enter the category name"
      />
      <Row justify="end" style={{ marginTop: 32 }}>
        <Space>
          <Button
            onClick={() => {
              if (!category) {
                message.error('Please input the category name');
                return;
              }
              updateCategory({
                description: category,
                id: categoryId,
                isItem: false
              });
            }}
            type="primary"
          >
            Update
          </Button>
          <Button
            onClick={() => {
              setOpenDetails(false);
            }}
            danger
          >
            Cancel
          </Button>
        </Space>
      </Row>
    </div>
  );
};

export default connectToRedux(CategoryUpdateComponent);
