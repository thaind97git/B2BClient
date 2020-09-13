import React from "react";
import { Layout } from "antd";
import RootLayout from "./RootLayout";

const { Content } = Layout;

const PageLayout = () => {
  return (
    <RootLayout>
      <Layout>
        <Content>Content</Content>
      </Layout>
    </RootLayout>
  );
};

export default PageLayout;
