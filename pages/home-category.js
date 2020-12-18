import React from 'react';
import ProductHomeByCategoryComponent from '../component/ProductHomeByCategoryComponent';
import HomePageLayout from '../layouts/HomePageLayout';
const ProductByCategoryPage = () => {
  return (
    <HomePageLayout isCategory>
      <ProductHomeByCategoryComponent />
    </HomePageLayout>
  );
};
export default ProductByCategoryPage;
