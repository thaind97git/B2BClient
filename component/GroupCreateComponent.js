import React, { useEffect } from "react";
import { Form, Input, Row, Col, Spin, Skeleton } from "antd";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createNewGroup, CreateNewGroupData } from "../stores/GroupState";
import {
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError,
  GetProductDetailsResetter,
} from "../stores/ProductState";

const FormItem = Form.Item;

const connectToRedux = connect(
  createStructuredSelector({
    createNewGroupData: CreateNewGroupData,
    productDetailsData: GetProductDetailsData,
    productDetailsError: GetProductDetailsError,
  }),
  (dispatch) => ({
    createNewGroup: ({ groupName, requestIds, description }) =>
      dispatch(createNewGroup({ groupName, requestIds, description })),
    getProduct: (id) => dispatch(getProductDetails(id)),
    resetData: () => {
      dispatch(GetProductDetailsResetter);
    },
  })
);

const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const GroupCreateComponent = ({
  createNewGroupData,
  createNewGroup,
  setOpenGroup,
  productId,
  getProduct,
  productDetailsData,
  productDetailsError,
  requestIds = [],
  resetData,
}) => {
  useEffect(() => {
    if (!!createNewGroupData) {
      setOpenGroup(false);
    }
  }, [setOpenGroup, createNewGroupData]);

  useEffect(() => {
    if (!!productId) {
      getProduct(productId);
    }
  }, [productId, getProduct]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const onFinish = (values) => {
    values.requestIds = requestIds;
    console.log({ values });
    createNewGroup(values);
  };

  if (!productDetailsData || productDetailsError) {
    return <Skeleton active />;
  }

  return (
    <Row align="middle" justify="center">
      <Col sm={20}>
        <Form
          id="group-create"
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={{
            productName: (productDetailsData || {}).productName,
          }}
        >
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Group Name"
                name="groupName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the group name",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter the group name" />
              </FormItem>
            </Col>
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Product Name"
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product title",
                  },
                ]}
              >
                <Input.TextArea
                  disabled
                  size="large"
                  placeholder="Enter the product name"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem label="Description" name="description">
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </FormItem>
            </Col>
          </Row>
          <i>
            Note: All of the requests choosing will automatic added to this
            Group
          </i>
        </Form>
      </Col>
    </Row>
  );
};

export default connectToRedux(GroupCreateComponent);
