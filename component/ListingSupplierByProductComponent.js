import React, { useEffect, useState } from "react";
import { Space, Divider, Tag } from "antd";
import { displayCurrency } from "../utils";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  getSupplierByProductId,
  GetSupplierByProductIdData,
  GetSupplierByProductIdError,
  GetSupplierByProductIdResetter,
} from "../stores/SupplierState";
import ReactTableLayout from "../layouts/ReactTableLayout";
import { get } from "lodash/fp";

const connectToRedux = connect(
  createStructuredSelector({
    supplierByProductIdData: GetSupplierByProductIdData,
    supplierByProductIdError: GetSupplierByProductIdError,
  }),
  (dispatch) => ({
    getSupplierByProductId: (pageIndex, pageSize, productId) =>
      dispatch(getSupplierByProductId({ productId, pageIndex, pageSize })),
    resetData: () => dispatch(GetSupplierByProductIdResetter),
  })
);

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "supplierEmail",
    key: "supplierEmail",
  },
  {
    title: "Quotation",
    dataIndex: "quotation",
    key: "quotation",
  },
];

const ListingSupplierByProductComponent = ({
  resetData,
  supplierByProductIdData,
  supplierByProductIdError,
  getSupplierByProductId,
  productId,
}) => {
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
          <div>
            <Tag style={{ fontSize: 12, padding: 4 }}>
              <div style={{ minWidth: 160 }}>
                {">="} {50} Units - <b>{displayCurrency(1150000)} / Unit</b>
              </div>
            </Tag>
            <Tag style={{ fontSize: 12, padding: 4 }}>
              <div style={{ minWidth: 160 }}>
                {">="} {100} Units - <b>{displayCurrency(1100000)} / Unit</b>
              </div>
            </Tag>
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
          <div>
            <Tag style={{ fontSize: 12, padding: 4 }}>
              <div style={{ minWidth: 160 }}>
                {">="} {40} Units - <b>{displayCurrency(1150000)} / Unit</b>
              </div>
            </Tag>
            <Tag style={{ fontSize: 12, padding: 4 }}>
              <div style={{ minWidth: 160 }}>
                {">="} {110} Units - <b>{displayCurrency(1100000)} / Unit</b>
              </div>
            </Tag>
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
          <div>
            <Tag style={{ fontSize: 12, padding: 4 }}>
              <div style={{ minWidth: 160 }}>
                {">="} {60} Units - <b>{displayCurrency(1150000)} / Unit</b>
              </div>
            </Tag>
            <Tag style={{ fontSize: 12, padding: 4 }}>
              <div style={{ minWidth: 160 }}>
                {">="} {120} Units - <b>{displayCurrency(1100000)} / Unit</b>
              </div>
            </Tag>
          </div>
          <Divider />
        </Space>
      ),
    },
  ];

  const [recordSelected, setRecordSelected] = useState([]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  let supplierData = [],
    total = 0;
  if (supplierByProductIdData) {
    supplierData = supplierByProductIdData.data;
    total = supplierByProductIdData.total;
  }

  const getSupplierTable = (supplierData = []) => {
    return [];
    //  (
    //   supplierData &&
    //   supplierData.length > 0 &&
    //   supplierData.map((supplier = {}) => ({
    //     productId: get("product.id")(supplier),
    //     key: supplier.id,
    //     price: displayCurrency(+supplier.preferredUnitPrice),
    //     quantity:
    //       (+supplier.quantity || 0) + " " + get("product.unitType")(supplier),
    //     createBy: supplier.buyer.fullName,
    //   }))
    // );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRecordSelected(selectedRows);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };
  return (
    <div>
      <ReactTableLayout
        dispatchAction={getSupplierByProductId}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        hasAction={false}
        data={getSupplierTable(supplierData || [])}
        columns={columns}
        totalCount={total}
        searchProps={{
          exCondition: [productId],
        }}
      />
    </div>
  );
};
export default connectToRedux(ListingSupplierByProductComponent);
