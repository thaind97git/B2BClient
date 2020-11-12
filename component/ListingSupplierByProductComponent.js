import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getSupplierByProductId,
  GetSupplierByProductIdData,
  GetSupplierByProductIdError,
  GetSupplierByProductIdResetter
} from '../stores/SupplierState';
import ReactTableLayout from '../layouts/ReactTableLayout';
import { get } from 'lodash/fp';
import QuotationDisplayComponent from './Utils/QuotationDisplayComponent';

const connectToRedux = connect(
  createStructuredSelector({
    supplierByProductIdData: GetSupplierByProductIdData,
    supplierByProductIdError: GetSupplierByProductIdError
  }),
  (dispatch) => ({
    getSupplierByProductId: (pageIndex, pageSize, productId) =>
      dispatch(getSupplierByProductId({ productId, pageIndex, pageSize })),
    resetData: () => dispatch(GetSupplierByProductIdResetter)
  })
);

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Email',
    dataIndex: 'supplierEmail',
    key: 'supplierEmail'
  },
  {
    title: 'Quotation',
    dataIndex: 'quotation',
    key: 'quotation'
  }
];

const ListingSupplierByProductComponent = ({
  resetData,
  supplierByProductIdData,
  getSupplierByProductId,
  productId,
  setSupplierIdSelected
}) => {
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
    return (
      supplierData &&
      supplierData.length > 0 &&
      supplierData.map((supplier = {}) => ({
        name:
          get('supplier.firstName')(supplier) +
          get('supplier.lastName')(supplier),
        key: get('supplier.id')(supplier),
        supplierEmail: get('supplier.email')(supplier),
        quotation: (supplier.description || []).map((quotation, index) => (
          <QuotationDisplayComponent quotation={quotation} key={index} />
        ))
      }))
    );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRecordSelected(selectedRows);
      const arraySupplierId = (selectedRows || []).map((row) => row.key);
      typeof setSupplierIdSelected === 'function' &&
        setSupplierIdSelected(arraySupplierId);
    },
    getCheckboxProps: (record) => ({
      name: record.name
    })
  };
  return (
    <div>
      <ReactTableLayout
        dispatchAction={getSupplierByProductId}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        hasAction={false}
        data={getSupplierTable(supplierData || [])}
        columns={columns}
        totalCount={total}
        searchProps={{
          exCondition: [productId]
        }}
      />
    </div>
  );
};
export default connectToRedux(ListingSupplierByProductComponent);
