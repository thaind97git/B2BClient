import React, { useState } from "react";
import { Button, Row, Space, Transfer, Tree } from "antd";

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
  const onChange = (keys) => {
    setTargetKeys(keys);
  };
  return (
    <div>
      <TreeTransfer
        dataSource={treeData}
        targetKeys={targetKeys}
        onChange={onChange}
      />
      <Row style={{ marginTop: 8 }} justify="end">
        <Space>
          <Button type="primary">Save you change</Button>
        </Space>
      </Row>
    </div>
  );
};
export default SupplierCategoryComponent;
