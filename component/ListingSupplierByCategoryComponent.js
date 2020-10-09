import React, { useState } from "react";
import { Checkbox, Row, Col, Typography, Space } from "antd";
const { Title } = Typography;
const CheckboxGroup = Checkbox.Group;

const ListingSupplierByCategoryComponent = ({}) => {
  const options = [
    {
      id: 1,
      content: (
        <Space>
          <Title level={5} style={{ marginBottom: 0 }}>
            Supplier 1
          </Title>

          <div>
            (
            <span>
              <i>thaindse62642@fpt.edu.vn</i>
            </span>
            )
          </div>
        </Space>
      ),
    },
    {
      id: 2,
      content: (
        <Space>
          <Title level={5} style={{ marginBottom: 0 }}>
            Supplier 2
          </Title>

          <div>
            (
            <span>
              <i>thaind97.dev@gmail.com</i>
            </span>
            )
          </div>
        </Space>
      ),
    },
    {
      id: 3,
      content: (
        <Space>
          <Title level={5} style={{ marginBottom: 0 }}>
            Supplier 3
          </Title>

          <div>
            (
            <span>
              <i>thaind97.info@gmail.com</i>
            </span>
            )
          </div>
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
      <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={option.indeterminate}
          onChange={onCheckAllChange}
          checked={option.checkAll}
        >
          Choose All Supplier
        </Checkbox>
      </div>
      <br />
      <CheckboxGroup value={option.checkedList} onChange={onChange}>
        <Row>
          {options.map((item, i) => (
            <Col index={i} span={24}>
              <Checkbox value={item.id}>{item.content}</Checkbox>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
    </div>
  );
};
export default ListingSupplierByCategoryComponent;
