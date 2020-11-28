import React from 'react';
import { StarFilled } from '@ant-design/icons';
const DisplayStarComponent = ({ star, isDisplay = true }) => {
  if (!isDisplay) {
    return 'N/A';
  }
  return (
    <span>
      {star}{' '}
      {
        <StarFilled
          style={{ fontSize: 16, color: 'yellow' }}
          twoToneColor="yellow"
        />
      }
    </span>
  );
};

export default DisplayStarComponent;
