import { Button } from 'antd';
import React from 'react';
import { displayCurrency } from '../../utils';

const QuotationDisplayComponent = ({
  quotation = {},
  unitLabel,
  size = 'small'
}) => {
  if (!quotation) {
    return null;
  }
  return (
    <div className="quotation">
      <Button
        size={size}
        type="dashed"
        style={{ cursor: 'unset', outline: 'none' }}
      >
        <div style={{ minWidth: 160 }}>
          <small>{'>='}</small> {quotation.quantity} {unitLabel || ''} -{' '}
          <b>{displayCurrency(quotation.price)}</b>
        </div>
      </Button>
      <br />
      <style jsx global>
        {`
          .quotation .ant-btn-dashed:hover,
          .ant-btn-dashed:focus {
            color: rgba(0, 0, 0, 0.65);
            background: #fff;
            border-color: #d9d9d9;
            border-style: dashed;
          }
        `}
      </style>
    </div>
  );
};

export default QuotationDisplayComponent;
