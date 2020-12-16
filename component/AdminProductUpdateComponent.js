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
  Skeleton,
  Empty,
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
import { acceptFileMimes, acceptFileTypes, getProductImage, openNotification } from "../utils";
import {
  getProductDetails,
  GetProductDetailsData,
  GetProductDetailsError,
  updateProduct,
  deleteProductImage
} from "../stores/ProductState";
import { useRouter } from 'next/router';
import AllCategoryComponent from "./AllCategoryComponent";

const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const connectToRedux = connect(
  createStructuredSelector({
    unitData: GetUnitOfMeasureData,
    productDetailData: GetProductDetailsData,
    productDetailError: GetProductDetailsError
  }),
  (dispatch) => ({
    getUnit: () => dispatch(getUnitOfMeasure()),
    deleteProductImage: (deleteFileList) =>
      dispatch(deleteProductImage(deleteFileList)),
    getProduct: (id) => dispatch(getProductDetails(id)),
    updateProduct: (product, newFileList, deleteFileList) =>
      dispatch(updateProduct(product, newFileList, deleteFileList))
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
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const AdminProductUpdateComponent = ({
  getUnit,
  unitData,
  getProduct,
  productDetailData,
  productDetailError,
  updateProduct,
  deleteProductImage
}) => {
  const [fileList, setFileList] = useState([]);
  const [category, setCategory] = useState('all');
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: ''
  });
  const router = useRouter();
  const [initForm, setInitForm] = useState({});
  const [deleteFileList, setDeleteFileList] = useState([]);

  let productID = router.query.id;
  useEffect(() => {
    getUnit();
  }, [getUnit]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(productID);
  }, [productID, getProduct]);

  useEffect(() => {
    if (productDetailError || productDetailData) {
      setLoading(false);
    }
  }, [productDetailData, productDetailError]);

  useEffect(() => {
    let initForm = {};
    initForm.productName = (productDetailData || {}).productName;
    initForm.description = (productDetailData || {}).description;
    initForm.unitOfMeasureId = (productDetailData || {})?.unitOfMeasure?.id;
    setCategory((productDetailData || {})?.category?.id);
    let newFileList = [];
    (productDetailData || { images: [] }).images.map((image = '') => {
      newFileList.push({
        uid: image,
        name: null,
        status: 'done',
        url: getProductImage(image)
      });
    });
    setInitForm(initForm);
    setFileList(newFileList);
  }, [productDetailData]);

  if (loading) {
    return <Skeleton active />;
  }
  if (!productDetailData) {
    return (
      <Empty
        style={{ padding: '180px 0px' }}
        description="Can not find any product !"
      />
    );
  }

  const onFinish = (values) => {
    if (!fileList || fileList.length === 0) {
      openNotification('error', { message: 'Please upload product image' });
    } else {
      const product = {
        id: productDetailData?.id,
        categoryId: category,
        productName: values?.productName,
        description: values.description.value,
        unitOfMeasureId: values.unitOfMeasureId
      };
      const newFileList = fileList.filter((file) => file.name !== null);
      if (deleteFileList !== null) {
        if (deleteFileList.length > 0) {
          deleteProductImage(deleteFileList)
        }
      }
      updateProduct(product, newFileList);
    }
  };

  const checkDescription = (rule, value = {}) => {
    if (value.value) {
      return Promise.resolve();
    }

    return Promise.reject('Please enter the product description !');
  };

  const onChangeImage = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      newFileList[newFileList.length - 1].status = 'done';
    }
    setFileList(newFileList);
  };

  const onRemoveImage = (file) => {
    const newDeleteFileList = [...deleteFileList];
    if (file?.name === null) {
      newDeleteFileList.push(file.uid);
    }
    setDeleteFileList(newDeleteFileList);
  };

  const onCancel = () => setPreview({ previewVisible: false });

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  return (
    <Row align="middle" justify="center">
      <Col sm={20} md={18}>
        <Form
          {...formItemLayout}
          autoComplete="new-password"
          className="register-form"
          onFinish={onFinish}
          initialValues={initForm}
        >
          <Row justify="center">
            <Title style={styles.titleStyle} level={2}>
              Update Product
            </Title>
          </Row>
          <Card
            bordered={false}
            title={<b>Product Basic Information</b>}
            style={{
              width: '100%',
              boxShadow: '2px 2px 14px 0 rgba(0,0,0,.1)',
              marginTop: 16
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
                      message: 'Please Enter Product Name'
                    }
                  ]}
                >
                  <Input />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <div class="ant-row ant-form-item">
                  <div class="ant-col ant-col-4 ant-form-item-label">
                    <label class="ant-form-item-required">Category</label>
                  </div>
                  <div class="ant-col ant-col-16 ant-form-item-control">
                    <AllCategoryComponent
                      defaultValue={(productDetailData || {})?.categorySequence}
                      changeOnSelect={false}
                      onGetLastValue={(value) => {
                        setCategory(value);
                      }}
                      size="large"
                      isSearchStyle={false}
                    />
                  </div>
                </div>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  label="Unit"
                  name="unitOfMeasureId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select unit'
                    }
                  ]}
                >
                  <Select
                    showSearch
                    style={{
                      width: '50%'
                    }}
                    placeholder="Select a unit"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={initForm?.unitOfMeasureId}
                  >
                    {!!unitData &&
                      unitData.map((type) => (
                        <Option value={type.id} index={type.id} key={type.id}>
                          {type.description}
                        </Option>
                      ))}
                  </Select>
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
                      validator: checkDescription
                    }
                  ]}
                >
                  <MarkdownEditorComponent
                    defaultValue={initForm?.description}
                  />
                </FormItem>
              </Col>
              <Col style={styles.colStyle} span={24}>
                <FormItem
                  name="imageList"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span> Image List
                    </span>
                  }
                >
                  <ImgCrop rotate>
                    <Upload
                      accept=".png, .jpg, .jpeg"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChangeImage}
                      onRemove={onRemoveImage}
                      onPreview={onPreview}
                      beforeUpload={(file) => {
                        if (acceptFileMimes.includes(file.type)) {
                          return true;
                        }
                        openNotification('error', {
                          message: `We just accept file type for ${acceptFileTypes}`
                        });
                        return false;
                      }}
                    >
                      {fileList.length < 5 && '+ Upload'}
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
      <Modal
        visible={preview.previewVisible}
        title={preview.previewTitle}
        footer={null}
        onCancel={onCancel}
      >
        <img
          alt="example"
          style={{ width: '100%' }}
          src={preview.previewImage}
        />
      </Modal>
    </Row>
  );
};

export default connectToRedux(AdminProductUpdateComponent);
