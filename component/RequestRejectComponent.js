import { Button, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  rejectRequest,
  RejectRequestData,
  RejectRequestError,
  RejectRequestResetter,
} from "../stores/RequestState";

const connectToRedux = connect(
  createStructuredSelector({
    rejectRequestData: RejectRequestData,
    rejectRequestError: RejectRequestError,
  }),
  (dispatch) => ({
    rejectRequest: (id, desc) => dispatch(rejectRequest(id, desc)),
    resetData: () => dispatch(RejectRequestResetter),
  })
);

const RequestRejectComponent = ({ rejectRequest, resetData, requestId }) => {
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);
  const [reason, setReason] = useState("");
  return (
    <Row justify="center">
      <Input.TextArea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Enter the reject reason"
        minLength={5}
      />
      <Button
        danger
        style={{ marginTop: 40 }}
        onClick={() => rejectRequest(requestId, reason)}
      >
        Submit
      </Button>
    </Row>
  );
};
export default connectToRedux(RequestRejectComponent);
