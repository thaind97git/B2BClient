import { Tag } from "antd";
import React from "react";
import { displayCurrency } from "../../utils";

const QuotationDisplayComponent = ({ quotation = {}, unitLabel }) => {
  if (!quotation) {
    return null;
  }
  return (
    <Tag style={{ fontSize: 14, padding: 6, textAlign: "center", margin: 4 }}>
      <div style={{ minWidth: 160 }}>
        {">="} {quotation.quantity} {unitLabel || ""} -{" "}
        <b>{displayCurrency(quotation.price)}</b>
      </div>
    </Tag>
  );
};

export default QuotationDisplayComponent;
