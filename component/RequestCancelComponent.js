import { Button, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  cancelRequest,
  CancelRequestData,
  CancelRequestError,
  CancelRequestResetter,
} from "../stores/RequestState";

const connectToRedux = connect(
  createStructuredSelector({
    cancelRequestData: CancelRequestData,
    cancelRequestError: CancelRequestError,
  }),
  (dispatch) => ({
    cancelRequest: (id, desc) => dispatch(cancelRequest(id, desc)),
    resetData: () => dispatch(CancelRequestResetter),
  })
);

const RequestCancelComponent = ({ cancelRequest, resetData, requestId }) => {
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);
  const [description, setDescription] = useState("");
  return (
    <Row justify="center">
      <Input.TextArea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Can you tell us the reason ?"
        minLength={5}
      />
      <Button
        danger
        style={{ marginTop: 40 }}
        onClick={() => cancelRequest(requestId, description)}
      >
        Submit
      </Button>
    </Row>
  );
};
export default connectToRedux(RequestCancelComponent);
