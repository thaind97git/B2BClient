import React, { useState } from "react";
import { Checkbox, Row, Col, Space, Divider } from "antd";
const CheckboxGroup = Checkbox.Group;

const ListingSupplierByCategoryComponent = () => {
  const options = [
    {
      id: 1,
      content: (
        <Space>
          <b style={{ marginBottom: 0 }}>Supplier 4</b>

          <div>
            (
            <span>
              <i>supplier4@gmail.com</i>
            </span>
            )
          </div>

          <Divider />
        </Space>
      ),
    },
    {
      id: 2,
      content: (
        <Space>
          <b style={{ marginBottom: 0 }}>Supplier 5</b>

          <div>
            (
            <span>
              <i>supplier5@gmail.com</i>
            </span>
            )
          </div>
          <Divider />
        </Space>
      ),
    },
    {
      id: 3,
      content: (
        <Space>
          <b style={{ marginBottom: 0 }}>Supplier 6</b>

          <div>
            (
            <span>
              <i>supplier6@gmail.com</i>
            </span>
            )
          </div>
          <Divider />
        </Space>
      ),
    },
  ];

  const [option, setCheckList] = useState({
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
      {/* <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={option.indeterminate}
          onChange={onCheckAllChange}
          checked={option.checkAll}
        >
          Choose All Supplier
        </Checkbox>
      </div> */}
      <br />
      <CheckboxGroup value={option.checkedList} onChange={onChange}>
        <Row>
          {options.map((item, i) => (
            <Col index={i} span={24}>
              <Checkbox value={item.id}>{item.content}</Checkbox> <a>Details</a>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
    </div>
  );
};
export default ListingSupplierByCategoryComponent;
