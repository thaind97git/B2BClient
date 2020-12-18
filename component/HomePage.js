import React from 'react';
import HomePageLayout from '../layouts/HomePageLayout';
import ProductListHomePageComponent from './ProductListHomePageComponent';
import ProductHomePageComponent from './ProductHomePageComponent';

const HomePage = () => {
  return (
    <HomePageLayout>
      <main id="main">
        <div className="product" id="product">
          <div className="container-fluid">
            <ProductHomePageComponent />
          </div>
        </div>
      </main>
    </HomePageLayout>
  );
};

export default HomePage;
