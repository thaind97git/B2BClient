import * as React from "react";
import { DatePicker } from "antd";

import { formatDate, isValidDateFormat, DATE_FORMAT } from "../utils";
const { RangePicker } = DatePicker;
const dateFormat = DATE_FORMAT;
function DateRangePicker({ setDateRange }) {
  const [selectedDate, setSelectedDate] = React.useState([null, null]);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('xs')) && 'mobile';

  const handleDateChange = (date = []) => {
    setSelectedDate(date);
    if (!date) {
      return;
    }

    const isAllOfTruthy = !!date[0] && !!date[1];
    const isAllOfFalsy = !date[0] && !date[1];

    if (!isAllOfFalsy && !isAllOfTruthy) {
      return;
    }
    let fromDate, toDate;

    if (isAllOfFalsy) {
      setDateRange({ fromDate, toDate });
      return;
    }

    if (isAllOfTruthy) {
      fromDate = formatDate(date[0]);
      toDate = formatDate(date[1]);
    }
    isValidDateFormat(fromDate) &&
      isValidDateFormat(toDate) &&
      setDateRange({ fromDate, toDate });
  };

  return (
    <>
      <RangePicker
        size="large"
        // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
        onChange={(date) => {
          handleDateChange(date);
        }}
        format={dateFormat}
        value={selectedDate}
      />
    </>
  );
}

export default DateRangePicker;
