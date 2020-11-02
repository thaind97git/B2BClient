import React, { useEffect, useState } from "react";
import { Space, Divider, Tag } from "antd";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getRequestSuggestByProductIdResetter,
  getRequestSuggestByProductId,
  getRequestSuggestByProductIdData,
} from "../stores/RequestState";
import {
  DATE_TIME_FORMAT,
  DEFAULT_PAGING_INFO,
  displayCurrency,
} from "../utils";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { get } from "lodash/fp";
import Moment from "react-moment";
import { AddRequestToGroupResetter } from "../stores/GroupState";

const connectToRedux = connect(
  createStructuredSelector({
    requestByProductIdData: getRequestSuggestByProductIdData,
  }),
  (dispatch) => ({
    getRequestByProductId: (pageIndex, pageSize, productId) =>
      dispatch(
        getRequestSuggestByProductId({ productId, pageIndex, pageSize })
      ),
    resetData: () => {
      dispatch(getRequestSuggestByProductIdResetter);
      dispatch(AddRequestToGroupResetter);
    },
  })
);

const columns = [
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Preferred Unit Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Create By",
    dataIndex: "createBy",
    key: "createBy",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
  },
];

const ListingRequestForGroupComponent = ({
  getRequestByProductId,
  requestByProductIdData,
  resetData,
  productId,
  setRequestIdSelected,
}) => {
  const [recordSelected, setRecordSelected] = useState([]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  let requestData = [],
    total = 0;
  if (requestByProductIdData) {
    requestData = requestByProductIdData.data;
    total = requestByProductIdData.total;
  }

  const getRequestTable = (requestData = []) => {
    return (
      requestData &&
      requestData.length > 0 &&
      requestData.map((request = {}) => ({
        productId: get("product.id")(request),
        key: request.id,
        price: displayCurrency(+request.preferredUnitPrice),
        quantity:
          (+request.quantity || 0) + " " + get("product.unitType")(request),
        dueDate: (
          <Moment format={DATE_TIME_FORMAT}>{new Date(request.dueDate)}</Moment>
        ),
        createBy: request.buyer.fullName,
      }))
    );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRecordSelected(selectedRows);
      const arrayRequestId = (selectedRows || []).map((row) => row.key);
      typeof setRequestIdSelected === "function" &&
        setRequestIdSelected(arrayRequestId);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };
  return (
    <div>
      <ReactTableLayout
        dispatchAction={getRequestByProductId}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        hasAction={false}
        data={getRequestTable(requestData || [])}
        columns={columns}
        totalCount={total}
        searchProps={{
          exCondition: [productId],
        }}
      />
    </div>
  );
};
export default connectToRedux(ListingRequestForGroupComponent);
