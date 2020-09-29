import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import { Divider, Input, Row } from "antd";

const emptyFunction = () => {};

function SearchTableComponent({
  placeholder = "Search by something",
  searchMessage,
  setSearchMessage = emptyFunction,
}) {
  // const [openAdvanceSearch, setOpenAdvanceSearch] = useState(false);
  const [value, setValue] = useState(searchMessage);
  const debounceLoadData = useCallback(debounce(setSearchMessage, 1000), []);

  function handleSearchChange(event) {
    const { value } = event.target;

    setValue(value);
    debounceLoadData(value);
  }

  return (
    <div
      // justify="space-between"
      // align="middle"
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Input
        value={value}
        placeholder={placeholder}
        onChange={handleSearchChange}
        bordered={false}
        prefix={<SearchOutlined />}
      />
      <Divider type="vertical" />
      {/* <IconButton
        onClick={() => setOpenAdvanceSearch(false)}
        color="primary"
        className={classes.iconButton}
      >
        <FilterList />
      </IconButton>
      <AlertDialog
        fullWidth
        size="sm"
        isFooter={false}
        isOpenDialog={openAdvanceSearch}
        setIsOpenDialog={setOpenAdvanceSearch}
        content={
          <Grid container justify="center" alignItems="center">
            Advance filter here (without date range)
          </Grid>
        }
      /> */}
    </div>
  );
}
export default SearchTableComponent;
