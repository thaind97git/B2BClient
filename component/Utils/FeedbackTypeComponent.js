import React from 'react';
const FeedbackTypeComponent = ({ feedback = {} }) => {
  const { order, request, reverseAuction } = feedback || {};
  let label;
  switch (true) {
    case !!order:
      label = 'Order';
      break;
    case !!request:
      label = 'Order';
      break;
    case !!reverseAuction:
      label = 'Reverse Auction';
      break;
    default:
      label = 'System';
      break;
  }
  return <span>{label}</span>;
};

export default FeedbackTypeComponent;
