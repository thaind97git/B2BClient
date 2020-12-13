import { useRouter } from 'next/router';
import React from 'react';
import ConfirmationOrderAuctionComponent from '../../../component/ConfirmationOrderAuctionComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
const Page = () => {
  const isNegotiating = useRouter().query.isNegotiating || false;
  return (
    <AggregatorLayout hasBackground={false}>
      <ConfirmationOrderAuctionComponent isNegotiating={isNegotiating} />
    </AggregatorLayout>
  );
};
export default withAuth(Page);
