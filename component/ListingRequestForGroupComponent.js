import React, { useState } from "react";
import { Checkbox, Row, Col, Space, Divider, Tag } from "antd";

const CheckboxGroup = Checkbox.Group;

const ListingRequestForGroupComponent = () => {
  const options = [
    {
      id: 1,
      content: (
        <Space>
          <b style={{ marginBottom: 0 }}>20 Units x 2.500.000 đ</b>

          <div>
            (
            <span>
              Posted inside <Tag color="processing">Action & Sports Camera</Tag>
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
          <b style={{ marginBottom: 0 }}>50 Units x 2.100.000 đ</b>

          <div>
            (
            <span>
              Posted inside <Tag color="processing">Action & Sports Camera</Tag>
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
          <b style={{ marginBottom: 0 }}>30 Units x 1.990.000 đ</b>

          <div>
            (
            <span>
              <i>
                Posted inside{" "}
                <Tag color="processing">Action & Sports Camera</Tag>
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
      {/* <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={option.indeterminate}
          onChange={onCheckAllChange}
          checked={option.checkAll}
        >
          Choose all Request
        </Checkbox>
      </div> */}
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
