import React, { useState } from "react";
import { Checkbox, Row, Col } from "antd";

const CheckboxGroup = Checkbox.Group;

const ListingRequestForGroupComponent = ({ category }) => {
  const options = [
    category + " request 1",
    category + " request 2",
    category + " request 3",
  ];

  const [
    option = { checkedList, indeterminate, checkAll },
    setCheckList,
  ] = useState({
    checkedList: [],
    indeterminate: false,
    checkAll: false,
  });

  const onChange = (checkedList) => {
    setCheckList({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < options.length,
      checkAll: checkedList.length === options.length,
    });
  };

  const onCheckAllChange = (e) => {
    setCheckList({
      checkedList: e.target.checked ? options : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  return (
    <div>
      <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={option.indeterminate}
          onChange={onCheckAllChange}
          checked={option.checkAll}
        >
          Check all
        </Checkbox>
      </div>
      <br />
      <CheckboxGroup value={option.checkedList} onChange={onChange}>
        <Row>
          {options.map((item, i) => (
            <Col span={24}>
              <Checkbox value={item}>{item}</Checkbox>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
    </div>
  );
};
export default ListingRequestForGroupComponent;
