import { Row, Skeleton, Tree, Typography } from 'antd';
import { get } from 'lodash/fp';
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getCategories,
  GetCategoriesDataSelector
} from '../stores/CategoryState';
const { DirectoryTree } = Tree;
const connectToRedux = connect(
  createStructuredSelector({
    categoryData: GetCategoriesDataSelector
  }),
  (dispatch) => ({
    getCategories: () => dispatch(getCategories())
  })
);
const { Title } = Typography;

let tree = [];
const CategoryHomePageComponent = ({
  categoryData,
  getCategories,
  setCurrentCategorySelected,
  onSelect
}) => {
  // useEffect(() => {
  //   if (!!categoryData) {
  //     const firstCate = get("[0]")(categoryData);
  //     setCurrentCategorySelected({
  //       name: firstCate.description,
  //       id: firstCate.id,
  //     });
  //   }
  // }, [categoryData, setCurrentCategorySelected]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  if (!!categoryData) {
    const mapData = (categoryData) => {
      const resultTmp = categoryData.map((category) => {
        let obj = {};
        obj.title = category.description;
        obj.key = category.id;
        if (!category.isItem) {
          obj.children = mapData(category.subCategories);
        }
        return obj;
      });
      return resultTmp;
    };
    tree = mapData(categoryData);
  }
  return (
    <Fragment>
      <Row>
        <Title level={4} style={{ padding: '16px 0px 8px 16px' }}>
          CATEGORIES
        </Title>
      </Row>
      <Row>
        {tree.length === 0 ? (
          <Skeleton active />
        ) : (
          <DirectoryTree
            icon={false}
            style={{ height: '100%' }}
            // defaultCheckedKeys={get('[0].id')(categoryData)}
            // defaultSelectedKeys={[get('[0].id')(categoryData)]}
            onSelect={onSelect}
            treeData={[
              { key: 'all', title: 'All Category', id: 'all' },
              ...tree
            ]}
          />
        )}
      </Row>
    </Fragment>
  );
};

export default connectToRedux(CategoryHomePageComponent);
