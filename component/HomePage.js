import React from "react";
import HomePageLayout from "../layouts/HomePageLayout";
import ProductListHomePageComponent from "./ProductListHomePageComponent";

const HomePage = () => {
  return (
    <HomePageLayout>
      <main id="main">
        <div
          style={{ marginTop: 24, marginBottom: 24 }}
          className="product"
          id="product"
        >
          <div className="container-fluid">
            <ProductListHomePageComponent />
          </div>
        </div>
      </main>
    </HomePageLayout>
  );
};

export default HomePage;
