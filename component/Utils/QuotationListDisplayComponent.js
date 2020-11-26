import React, { Fragment } from 'react';
import QuotationDisplayComponent from './QuotationDisplayComponent';

const QuotationListDisplayComponent = ({ quotations = [], unitLabel }) => {
  if (!quotations.length) {
    return null;
  }
  return (
    <Fragment>
      {quotations.map((quotation, index) => {
        return (
          <Fragment>
            <QuotationDisplayComponent
              key={index}
              quotation={quotation}
              unitLabel={unitLabel}
            />
            <br />
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default QuotationListDisplayComponent;
