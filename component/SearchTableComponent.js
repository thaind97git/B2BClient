import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import { Divider, Input } from "antd";

const emptyFunction = () => {};

function SearchTableComponent({
  placeholder = "",
  searchMessage,
  setSearchMessage = emptyFunction,
}) {
  const [value, setValue] = useState(searchMessage);
  const debounceLoadData = useCallback(debounce(setSearchMessage, 1000), []);

  function handleSearchChange(event) {
    const { value } = event.target;

    setValue(value);
    debounceLoadData(value);
  }

  return (
    <div
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
    </div>
  );
}
export default SearchTableComponent;
