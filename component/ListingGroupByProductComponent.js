import { Col, Collapse, Divider, Empty, Radio, Row, Skeleton, Tag } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createLink } from "../libs";
import {
  getGroupByProductId,
  GetGroupByProductIdData,
  GetGroupByProductIdError,
  GetGroupByProductIdResetter,
} from "../stores/GroupState";
import { displayCurrency } from "../utils";
const { Panel } = Collapse;
function onChange(checkedValues) {
  console.log("checked = ", checkedValues);
}
const connectToRedux = connect(
  createStructuredSelector({
    getGroupByProductIdData: GetGroupByProductIdData,
    getGroupByProductIdError: GetGroupByProductIdError,
  }),
  (dispatch) => ({
    getGroupByProductId: (id) => dispatch(getGroupByProductId(id)),
    resetData: () => dispatch(GetGroupByProductIdResetter),
  })
);

const calculateGroupRequest = (group = []) => {
  const requests = group.requests || [];
  const totalRequest = requests.length;
  const totalQuantity = requests.reduce((prev, current) => {
    return prev + +current.quantity;
  }, 0);
  const minPrice = Math.min(
    requests.map((request) => +request.preferredUnitPrice)
  );
  const maxPrice = Math.max(
    requests.map((request) => +request.preferredUnitPrice)
  );
  return {
    totalRequest,
    totalQuantity: totalQuantity + " " + (requests[0] || {}).product.unitType,
    minPrice: displayCurrency(minPrice),
    maxPrice: displayCurrency(maxPrice),
  };
};

const ListingGroupByProductComponent = ({
  getGroupByProductIdData,
  getGroupByProductIdError,
  getGroupByProductId,
  productId,
  resetData,
}) => {
  useEffect(() => {
    resetData();
  }, [resetData]);
  useEffect(() => {
    if (!!productId) {
      getGroupByProductId(productId);
    }
  }, [productId, getGroupByProductId]);

  if (!getGroupByProductIdData || getGroupByProductIdError) {
    return <Skeleton active />;
  }

  let groupData = [],
    count = 0;
  if (getGroupByProductIdData) {
    groupData = getGroupByProductIdData.data;
    count = getGroupByProductIdData.total;
  }

  if (groupData.length === 0) {
    return <Empty />;
  }

  return (
    <Radio.Group style={{ width: "100%" }} onChange={onChange}>
      <Row>
        {groupData.map((group) => {
          const {
            totalRequest,
            totalQuantity,
            minPrice,
            maxPrice,
          } = calculateGroupRequest(group);
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
  );
};

export default connectToRedux(ListingGroupByProductComponent);
