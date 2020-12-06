import React from 'react';
const DisplayStarComponent = ({ star, isDisplay = true }) => {
  if (!isDisplay) {
    return 'N/A';
  }
  return (
    <span>
      {star} {<img alt="star" src="/static/images/star.png" width={16} />}
    </span>
  );
};

export default DisplayStarComponent;
