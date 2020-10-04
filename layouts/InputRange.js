import React from "react";
const { Input, Select, InputNumber } = require("antd");

const InputRange = ({
  value = {},
  onChange,
  minProps,
  maxProps,
  inputGroupProps,
  setValue,
}) => {
  const triggerChange = (changedData) => {
    const objectMerged = Object.assign({}, value, changedData);
    onChange(objectMerged);
    setValue(objectMerged);
  };

  return (
    <Input.Group compact style={{ width: "100%" }} {...inputGroupProps}>
      <InputNumber
        defaultValue={value.min || ""}
        min={1}
        style={{ width: 150, textAlign: "center" }}
        onChange={(min) => triggerChange({ min })}
        {...minProps}
      />
      <Input
        style={{
          width: "10%",
          borderLeft: 0,
          pointerEvents: "none",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
        placeholder="~"
        disabled
      />
      <InputNumber
        defaultValue={value.max || ""}
        style={{ width: 150, textAlign: "center", borderLeft: 0 }}
        onChange={(max) => triggerChange({ max })}
        {...maxProps}
      />
    </Input.Group>
  );
};

export default InputRange;
