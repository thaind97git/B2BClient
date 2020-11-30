import { Avatar } from 'antd';
import React, { Fragment } from 'react';
import QuotationDisplayComponent from './QuotationDisplayComponent';

const QuotationListDisplayComponent = ({
  quotations = [],
  unitLabel,
  isTooltip = false
}) => {
  if (!quotations.length) {
    return null;
  }
  const tooltipSecondQuotation = quotations.slice(1, quotations.length) || {};
  return (
    <div>
      {isTooltip ? (
        quotations.length > 0 ? (
          <Avatar.Group
            maxCount={1}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            <QuotationDisplayComponent
              unitLabel={unitLabel}
              quotation={quotations[0]}
            />
            {tooltipSecondQuotation &&
              tooltipSecondQuotation.map((quotation, index) => {
                return (
                  <QuotationDisplayComponent
                    unitLabel={unitLabel}
                    key={index}
                    quotation={quotation}
                  />
                );
              })}
          </Avatar.Group>
        ) : (
          'N/A'
        )
      ) : (
        quotations.map((quotation, index) => {
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
        })
      )}
    </div>
  );
};

export default QuotationListDisplayComponent;
