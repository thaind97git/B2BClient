import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Select,
  Upload,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import BuyerRequestCategoryComponent from "./BuyerRequestCategoryComponent";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { getCategorySelected } from "../libs";
import { SET_CATEGORY_SELECTED } from "../stores/initState";
import {
  getUnitOfMeasure,
  GetUnitOfMeasureData,
} from "../stores/SupportRequestState";
import ImgCrop from "antd-img-crop";
import MarkdownEditorComponent from "./MarkdownEditorComponent";
import { openNotification } from "../utils";
import { createNewProduct } from "../stores/ProductState";

const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    categorySelected: (state) => state.categorySelected,
    unitData: GetUnitOfMeasureData,
  }),
  (dispatch) => ({
    removeCategorySelected: () =>
      dispatch({ type: SET_CATEGORY_SELECTED, payload: [] }),
    getUnit: () => dispatch(getUnitOfMeasure()),
    createNewProduct: (product, fileList) =>
      dispatch(createNewProduct(product, fileList)),
  })
);
const styles = {
  colStyle: { padding: "0 8px" },
  titleStyle: { fontWeight: 500 },
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const AdminProductCreateComponent = ({
  removeCategorySelected,
  categorySelected,
  getUnit,
  unitData,
  createNewProduct,
}) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getUnit();
  }, [getUnit]);

  const onFinish = (values) => {
    if (!categorySelected || categorySelected.length === 0) {
      openNotification("error", { message: "Please select category" });
    } else if (!fileList || fileList.length === 0) {
      openNotification("error", { message: "Please upload product image" });
    } else {
      console.log(values);
      values.categoryId = categorySelected[categorySelected.length - 1].id;
      values.description = values.description.value;
      createNewProduct(values, fileList);
      removeCategorySelected();
    }
  };

  const checkDescription = (rule, value = {}) => {
    console.log({ value });
    if (value.value) {
      return Promise.resolve();
    }

    return Promise.reject("Please enter the product description !");
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <Row align="middle" justify="center">
      <Modal
        title="Choose Category"
        centered
        visible={openCategory}
        onOk={() => setOpenCategory(false)}
        onCancel={() => setOpenCategory(false)}
        width={1000}
      >
        <BuyerRequestCategoryComponent
          doneFunc={() => setOpenCategory(false)}
        />
        <Row>
          {!!categorySelected.length && (
            <Title level={4}>
              Category selected:
              {getCategorySelected(
                categorySelected.map((cate) => cate.description)
              ).substring(3)}
            </Title>
          )}
        </Row>
      </Modal>
      <Col sm={20} md={18}>
        <Form
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
        >
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              Create New Product
            </Title>
          </Row>
          <Card
            bordered={false}
            title={<b>Product Basic Information</b>}
            style={{
              width: "100%",
              boxShadow: "2px 2px 14px 0 rgba(0,0,0,.1)",
              marginTop: 16,
            }}
          >
            <Row align="middle">
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Product Name"
                  name="productName"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Product Name",
                    },
                  ]}
                >
                  <Input />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Category
                    </span>
                  }
                  name="category"
                >
                  {!!categorySelected.length && (
                    <div>
                      Category selected:
                      {getCategorySelected(
                        categorySelected.map((cate) => cate.description)
                      ).substring(3)}
                    </div>
                  )}
                  <Button onClick={() => setOpenCategory(true)}>
                    Select Category
                  </Button>
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Unit"
                  name="unitOfMeasureId"
                  rules={[
                    {
                      required: true,
                      message: "Please select unit",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    style={{
                      width: "50%",
                    }}
                    placeholder="Select a unit"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {!!unitData &&
                      unitData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
                  </Select>
                  {/* <QuantityInput unitData={unitData} /> */}
                </FormItem>
              </Col>
            </Row>
            <Row align="middle">
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      validator: checkDescription,
                    },
                  ]}
                >
                  <MarkdownEditorComponent />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  name="imageList"
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Image List
                    </span>
                  }
                >
                  <ImgCrop rotate>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                    >
                      {fileList.length < 5 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Row justify="center" align="middle">
            <Col span={6}>
              <Button
                onClick={() => {}}
                block
                className="submit"
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default connectToRedux(AdminProductCreateComponent);
