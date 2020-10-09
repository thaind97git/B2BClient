import { Badge, Descriptions } from "antd";
import React from "react";
import { displayCurrency } from "../utils";

const REQUEST = {
  category: "Clothes/Shirt/Men",
  title: "T-Shirt Men",
  quantity: 100,
  unit: "set",
  preUnitPrice: 100,
  dueDate: "2018-04-24 18:00:00",
  deliveryAddress: "FPT University - Khu Cong Nghe Cao - Q9 - TP.HCM",
  description: "Description here",
};

const BuyerRequestConfirmationComponent = ({ request = REQUEST }) => {
  const {
    category,
    title,
    quantity,
    unit,
    preUnitPrice,
    dueDate,
    deliveryAddress,
    description,
  } = request;
  return (
    <div style={{ margin: "32px 24px" }}>
      <Descriptions title={category} bordered>
        <Descriptions.Item span={3} label="Product Name">
          {title}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Quantity">
          {quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Unit">{unit}</Descriptions.Item>
        <Descriptions.Item span={2} label="Due Time">
          {dueDate}
        </Descriptions.Item>
        <Descriptions.Item label="Preferred Unit Price" span={2}>
          {displayCurrency(preUnitPrice)}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Address" span={3}>
          {deliveryAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {description}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default BuyerRequestConfirmationComponent;
