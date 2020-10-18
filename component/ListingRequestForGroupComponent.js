import React, { useState } from "react";
import { Checkbox, Row, Col, Space, Divider, Tag } from "antd";

const CheckboxGroup = Checkbox.Group;

const ListingRequestForGroupComponent = () => {
  const options = [
    {
      id: 1,
      content: (
        <Space>
          <b style={{ marginBottom: 0 }}>
            Iphone 7s 64Gb - 20 Units x 7.500.000 đ
          </b>

          <div>
            (
            <span>
              Posted inside <Tag color="processing">Iphone</Tag>
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
          <b style={{ marginBottom: 0 }}>
            Iphone 7s 32Gb - 50 Units x 6.500.000 đ
          </b>

          <div>
            (
            <span>
              Posted inside <Tag color="processing">Iphone</Tag>
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
          <b style={{ marginBottom: 0 }}>
            Iphone 6s 64Gb - 30 Units x 6.000.000 đ
          </b>

          <div>
            (
            <span>
              <i>
                Posted inside <Tag color="processing">Iphone</Tag>
              </i>
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
      <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={option.indeterminate}
          onChange={onCheckAllChange}
          checked={option.checkAll}
        >
          Choose all Request
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
export default ListingRequestForGroupComponent;
