import React, { useState } from "react";
import { Collapse, Row, Tree } from "antd";
const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const initTreeDate = [
  {
    title: "Expand to load",
    key: "0",
  },
  {
    title: "Expand to load",
    key: "1",
  },
  {
    title: "Tree Node",
    key: "2",
    isLeaf: true,
  },
]; // It's just a simple demo. You can use tree map to optimize update perf.

function callback(key) {
  console.log(key);
}

const BuyerRequestCategoryComponent = ({}) => {
  const [expandedKeys, setExpandedKeys] = useState(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  return (
    <>
      <Panel disabled header="This is panel header 1" key="1">
        <p>{text}</p>
      </Panel>
      <Panel header="This is panel header 2" key="2">
        <p>{text}</p>
      </Panel>
      <Panel header="This is panel header 3" key="3">
        <p>{text}</p>
      </Panel>
    </>
  );
};

export default BuyerRequestCategoryComponent;
