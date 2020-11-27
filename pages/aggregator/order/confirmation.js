import { useRouter } from 'next/router';
import React from 'react';
import ConfirmationOrderComponent from '../../../component/ConfirmationOrderComponent';
import withAuth from '../../../component/HOC/AuthenHOC';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
const Page = () => {
  const isNegotiating = useRouter().query.isNegotiating || false;
  return (
    <AggregatorLayout hasBackground={false}>
      <ConfirmationOrderComponent isNegotiating={isNegotiating} />
    </AggregatorLayout>
  );
};
export default withAuth(Page);
