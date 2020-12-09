import { Col, Collapse, Empty, Pagination, Radio, Row, Skeleton } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createLink } from "../libs";
import {
  getGroupByProductId,
  GetGroupByProductIdData,
  GetGroupByProductIdError,
  GetGroupByProductIdResetter,
} from "../stores/GroupState";
import {G_PENDING, G_NEGOTIATING} from '../enums/groupStatus'
import { calculateGroupRequest } from "../utils";
const { Panel } = Collapse;
const connectToRedux = connect(
  createStructuredSelector({
    getGroupByProductIdData: GetGroupByProductIdData,
    getGroupByProductIdError: GetGroupByProductIdError,
  }),
  (dispatch) => ({
    getGroupByProductId: (id, pageIndex, pageSize) =>
      dispatch(getGroupByProductId(id, pageIndex, pageSize)),
    resetData: () => dispatch(GetGroupByProductIdResetter),
  })
);

const ListingGroupByProductComponent = ({
  getGroupByProductIdData,
  getGroupByProductIdError,
  getGroupByProductId,
  productId,
  resetData,
  setCurrentGroupId,
}) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  function onChange(checkedValues) {
    setCurrentGroupId(checkedValues.target.value);
  }
  useEffect(() => {
    resetData();
  }, [resetData]);
  useEffect(() => {
    if (!!productId) {
      getGroupByProductId(productId, pageIndex, pageSize);
    }
  }, [productId, getGroupByProductId, pageIndex, pageSize]);

  if (!getGroupByProductIdData || getGroupByProductIdError) {
    return <Skeleton active />;
  }

  let groupData = [],
    count = 0;
  if (getGroupByProductIdData) {
    groupData = getGroupByProductIdData.data;
    groupData = groupData.filter(
      (group) =>
        group.groupStatus.id === G_NEGOTIATING ||
        group.groupStatus.id === G_PENDING
    );
    count = groupData.total;
  }

  if (groupData.length === 0) {
    return <Empty />;
  }

  return (
    <Fragment>
      <Radio.Group style={{ width: "100%" }} onChange={onChange}>
        <Row>
          {groupData.map((group) => {
            const {
              totalRequest,
              totalQuantity,
              minPrice,
              maxPrice,
            } = calculateGroupRequest(group.requests);
            return (
              <Col key={group.id} span={24}>
                <Radio style={{ width: "100%" }} value={group.id}>
                  <b>{group.groupName}</b>{" "}
                  {/* created inside <Tag color="processing">Action & Sports Camera</Tag> */}
                  <div>
                    <Collapse bordered={false} defaultActiveKey={[]}>
                      <Panel header="More details" key={group.id}>
                        <ul>
                          <li>
                            Total RFQ added: <b>{totalRequest}</b>
                          </li>
                          <li>
                            Total quantity: <b>{totalQuantity}</b>
                          </li>
                          <li>
                            Min RFQ price: <b>{minPrice}</b>
                          </li>
                          <li>
                            Max RFQ price: <b>{maxPrice}</b>
                          </li>
                          <li>
                            Note: <i>{group.description || "N/A"}</i>
                          </li>
                          <li>
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={createLink([
                                "aggregator",
                                "group",
                                `details?id=${group.id}`,
                              ])}
                            >
                              View details
                            </a>
                          </li>
                        </ul>
                      </Panel>
                    </Collapse>
                  </div>
                </Radio>
              </Col>
            );
          })}
        </Row>
      </Radio.Group>
      <Row justify="end">
        <Pagination
          showSizeChanger
          current={pageIndex}
          onChange={(page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          }}
          pageSize={pageSize}
          total={count}
        />
      </Row>
    </Fragment>
  );
};

export default connectToRedux(ListingGroupByProductComponent);
