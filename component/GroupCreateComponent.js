import React, { useEffect } from "react";
import { Form, Input, Row, Col, Cascader } from "antd";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createNewGroup, CreateNewGroupData } from "../stores/GroupState";

const FormItem = Form.Item;

const connectToRedux = connect(
  createStructuredSelector({
    createNewGroupData: CreateNewGroupData,
  }),
  (dispatch) => ({
    createNewGroup: ({ groupName, productId, description }) =>
      dispatch(createNewGroup({ groupName, productId, description })),
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
}) => {
  useEffect(() => {
    if (!!createNewGroupData) {
      setOpenGroup(false);
    }
  }, [setOpenGroup, createNewGroupData]);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  function onChange(value) {
    console.log(value);
  }

  return (
    <Row align="middle" justify="center">
      <Col sm={20}>
        <Form
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={{
            unit: "Set",
          }}
        >
          <Row align="middle">
            <Col style={styles.colStyle} span={24}>
              <FormItem
                label="Group Name"
                name="groupTitle"
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
                <Input size="large" placeholder="Enter the product name" />
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
        </Form>
      </Col>
    </Row>
  );
};

export default connectToRedux(GroupCreateComponent);
