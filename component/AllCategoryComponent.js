import { Cascader } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getCategories,
  GetCategoriesDataSelector
} from '../stores/CategoryState';
const connectToRedux = connect(
  createStructuredSelector({
    allCategoryData: GetCategoriesDataSelector
  }),
  (dispatch) => ({
    getAllCategory: () => dispatch(getCategories())
  })
);
let optionCate = [];

const AllCategoryComponent = ({
  allCategoryData,
  getAllCategory,
  onGetValue,
  onGetLabel,
  onGetLastValue,
  isSearchStyle = true,
  style = {},
  defaultLabel = 'All Category',
  onGetLastLabel,
  ...other
}) => {
  const allCateOption = {
    label: defaultLabel,
    value: 'all'
  };
  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  if (!!allCategoryData) {
    const mapData = (categoryData) => {
      const resultTmp = categoryData.map((category) => {
        let obj = {};
        obj.label = category.description;
        obj.value = `${category.id},${category.description}`;
        if (!category.isItem) {
          obj.children = mapData(category.subCategories);
        }
        return obj;
      });
      return resultTmp;
    };
    optionCate = mapData(allCategoryData);
    optionCate.unshift(allCateOption);
  }

  function onChange(value = []) {
    const currentLabelSelected = value.map((item) => item.split(',')[1]);
    const currentValueSelected = value.map((item) => item.split(',')[0]);
    typeof onGetLabel === 'function' &&
      onGetLabel(currentLabelSelected.join(' >> '));
    typeof onGetValue === 'function' && onGetValue(currentValueSelected);
    typeof onGetLastValue === 'function' &&
      onGetLastValue(currentValueSelected[currentValueSelected.length - 1]);
    typeof onGetLastLabel === 'function' &&
      onGetLastLabel(currentLabelSelected[currentLabelSelected.length - 1]);
  }
  return (
    <Fragment>
      <Cascader
        placeholder="Select category"
        style={Object.assign(
          {},
          isSearchStyle && { width: '224px', margin: '-5px -14px', height: 40 },
          style
        )}
        options={optionCate}
        onChange={onChange}
        defaultValue={['all']}
        {...other}
      />
      <style jsx global>
        {`
          #search-product .ant-input.ant-cascader-input {
            height: 44px;
          }
        `}
      </style>
    </Fragment>
  );
};

export default connectToRedux(AllCategoryComponent);
