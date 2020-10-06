import { Button, Col, Row, Steps, Typography } from "antd";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import BuyerRequestCategoryComponent from "../../../component/BuyerRequestCategoryComponent";
import BuyerRequestConfirmationComponent from "../../../component/BuyerRequestConfirmationComponent";
import BuyerRequestCreateComponent from "../../../component/BuyerRequestCreateComponent";
import BuyerLayout from "../../../layouts/BuyerLayout";
import { getCategorySelected } from "../../../libs";
import { SET_CATEGORY_SELECTED } from "../../../stores/initState";
import { openNotification } from "../../../utils";
const { Step } = Steps;
const { Title } = Typography;

const connectToRedux = connect(
  createStructuredSelector({
    categorySelected: (state) => state.categorySelected,
  }),
  (dispatch) => ({
    setCategorySelected: (newCategorySelected) =>
      dispatch({ type: SET_CATEGORY_SELECTED, payload: newCategorySelected }),
  })
);

const enhance = compose(connectToRedux);

const Page = ({ setCategorySelected, categorySelected }) => {
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    console.log({ categorySelected });
  }, [categorySelected]);
  const next = () => {
    const current = currentStep + 1;
    setCurrentStep(current);
  };

  const prev = () => {
    const current = currentStep - 1;
    setCurrentStep(current);
  };
  const steps = [
    {
      title: "Choose Product",
      content: (
        <Row justify="center">
          <Col span={14} md={16} sm={20}>
            <BuyerRequestCategoryComponent next={next} />
          </Col>
        </Row>
      ),
    },
    {
      title: "Tell Us what you need",
      content: <BuyerRequestCreateComponent next={next} />,
    },
    {
      title: "Confirm your request",
      content: <BuyerRequestConfirmationComponent />,
    },
  ];
  return (
    <BuyerLayout>
      <Row>
        <Col sm={24} span={20}>
          <Row justify="center">
            {!!categorySelected.length && (
              <Title level={4}>
                Category selected:
                {getCategorySelected(
                  categorySelected.map((cate) => cate.description)
                )}
              </Title>
            )}
          </Row>
          <Steps current={currentStep}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[currentStep].content}</div>
          <div className="steps-action">
            <Row
              justify="center"
              style={{ margin: "32px 0px", flexDirection: "column" }}
            >
              {currentStep === steps.length - 1 && (
                <Row justify="center">
                  <Button
                    style={{ width: 200, margin: "24px 0px" }}
                    type="primary"
                    size="large"
                    onClick={() => {
                      openNotification("success", {
                        message: "Processing complete!",
                      });
                      setCategorySelected([]);
                      Router.push("/buyer/request");
                    }}
                  >
                    Submit
                  </Button>
                </Row>
              )}
              {currentStep > 0 && (
                <Row justify="center">
                  <Button
                    size="large"
                    style={{ width: 200 }}
                    onClick={() => {
                      (categorySelected || []).pop();
                      setCategorySelected(categorySelected);
                      prev();
                    }}
                  >
                    Previous
                  </Button>
                </Row>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </BuyerLayout>
  );
};
export default enhance(Page);
