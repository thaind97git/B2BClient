import React from 'react';
import AggregatorLayout from '../../../layouts/AggregatorLayout';
import GroupChatComponent from '../../../component/GroupChatComponent';
import withAuth from '../../../component/HOC/AuthenHOC';

function Chat() {
  return (
    <AggregatorLayout isChat>
      <GroupChatComponent />
    </AggregatorLayout>
  );
}

export default withAuth(Chat);
