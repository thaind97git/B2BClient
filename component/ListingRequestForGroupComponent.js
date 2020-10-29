import React, { useEffect, useState } from "react";
import { Checkbox, Row, Col, Space, Divider, Tag } from "antd";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getRequestByProductIdData,
  getRequestSuggestByProductIdResetter,
  getRequestSuggestByProductId,
  getRequestSuggestByProductIdData,
} from "../stores/RequestState";
import { DEFAULT_PAGING_INFO } from "../utils";

const CheckboxGroup = Checkbox.Group;

const connectToRedux = connect(
  createStructuredSelector({
    requestByProductIdData: getRequestSuggestByProductIdData,
  }),
  (dispatch) => ({
    getRequestByProductId: ({ productId, pageIndex, pageSize }) =>
      dispatch(
        getRequestSuggestByProductId({ productId, pageIndex, pageSize })
      ),
    resetData: () => {
      dispatch(getRequestSuggestByProductIdResetter);
    },
  })
);

const ListingRequestForGroupComponent = ({
  getRequestByProductId,
  requestByProductIdData,
  resetData,
  productId,
}) => {
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGING_INFO.page);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGING_INFO.pageSize);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    if (productId) {
      getRequestByProductId({ productId, pageIndex, pageSize });
    }
  }, [productId, getRequestByProductId, pageIndex, pageSize]);
  console.log({ requestByProductIdData });
  const options = [
    {
      id: 1,
      content: (
        <Space>
          <b style={{ marginBottom: 0 }}>20 Units x 1.250.000 đ</b>

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
          <b style={{ marginBottom: 0 }}>50 Units x 1.300.000 đ</b>

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
          <b style={{ marginBottom: 0 }}>30 Units x 1.400.000 đ</b>

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
export default connectToRedux(ListingRequestForGroupComponent);
