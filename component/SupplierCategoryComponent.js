import React, { useState } from "react";
import { Button, Col, Row, Space, Transfer, Tree } from "antd";
import Modal from "antd/lib/modal/Modal";
import SupplierRequestProductComponent from "./SupplierRequestProductComponent";

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) =>
  selectedKeys.indexOf(eventKey) !== -1;

const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: generateTree(children, checkedKeys),
  }));

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      titles={["System Category", "Your Category"]}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title}
      showSelectAll={false}
      operations={["Add", "Remove"]}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === "left") {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={generateTree(dataSource, targetKeys)}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
            />
          );
        }
      }}
    </Transfer>
  );
};

const treeData = [
  { key: "0-0", title: "Health,Beauty & Body" },
  {
    key: "0-1",
    title: "Health,Beauty",
    children: [
      { key: "0-1-0", title: "Products for Men" },
      { key: "0-1-1", title: "Lip Care" },
      { key: "0-1-2", title: "Feminine Hygiene & Sexual Assistance" },
    ],
  },
  {
    key: "0-2",
    title: "Body",
    children: [{ key: "0-2-0", title: "Makeup Accessories" }],
  },
];
const SupplierCategoryComponent = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [openRequestProduct, setOpenRequestProduct] = useState(true);
  const onChange = (keys) => {
    setTargetKeys(keys);
  };
  return (
    <div>
      <Modal
        okText="Submit"
        width={1000}
        title="Request new product"
        visible={openRequestProduct}
        onOk={() => setOpenRequestProduct(false)}
        // onCancel={this.handleCancel}
      >
        <SupplierRequestProductComponent />
      </Modal>
      <Row>
        <Col span={24}>
          <Row style={{ marginBottom: 32 }} justify="end">
            <div>
              <Button
                onClick={() => setOpenRequestProduct(true)}
                type="primary"
              >
                Request new product
              </Button>
            </div>
          </Row>
        </Col>
        <Col span={24}>
          <TreeTransfer
            dataSource={treeData}
            targetKeys={targetKeys}
            onChange={onChange}
          />
          <Row style={{ marginTop: 8 }} justify="end">
            <Space>
              <Button type="primary">Save</Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default SupplierCategoryComponent;
