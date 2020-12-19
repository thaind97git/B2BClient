import { Button, Input, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  createCategory,
  CreateCategoryData,
  CreateCategoryError,
  CreateCategoryResetter
} from '../stores/CategoryState';
import { openNotification } from '../utils';

const connectToRedux = connect(
  createStructuredSelector({
    createCategoryData: CreateCategoryData,
    createCategoryError: CreateCategoryError
  }),
  (dispatch) => ({
    createCategory: ({ description, parentId, isItem }, callback) =>
      dispatch(
        createCategory(
          {
            description,
            parentCategoryId: parentId,
            isItem
          },
          callback
        )
      ),
    resetCreate: () => dispatch(CreateCategoryResetter)
  })
);
const CategoryAddNewComponent = ({
  resetCreate,
  setOpenAdd,
  createCategory,
  createCategoryData,
  parentCategoryId,
  onCallbackSuccess
}) => {
  const [category, setCategory] = useState();
  useEffect(() => {
    return () => {
      resetCreate();
    };
  }, [resetCreate]);

  useEffect(() => {
    if (!!createCategoryData) {
      setOpenAdd(false);
      typeof onCallbackSuccess === 'function' && onCallbackSuccess();
    }
  }, [createCategoryData, setOpenAdd, onCallbackSuccess]);

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
                openNotification('error', {
                  message: 'Please input the category name'
                });
                return;
              }
              createCategory({
                description: category,
                parentCategoryId
              });
            }}
            type="primary"
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              setOpenAdd(false);
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

export default connectToRedux(CategoryAddNewComponent);
