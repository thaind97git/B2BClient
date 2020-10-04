import { Button, message, Row, Steps } from "antd";
import React, { useState } from "react";
import BuyerRequestCategoryComponent from "../../../component/BuyerRequestCategoryComponent";
import BuyerRequestCreateComponent from "../../../component/BuyerRequestCreateComponent";
import BuyerLayout from "../../../layouts/BuyerLayout";
const { Step } = Steps;
const steps = [
  {
    title: "Choose Category for your request",
    content: (
      <Row style={{ width: "100%", minHeight: 400 }}>
        <BuyerRequestCategoryComponent />
      </Row>
    ),
  },
  {
    title: "Tell Us what you need",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const next = () => {
    const current = currentStep + 1;
    setCurrentStep(current);
  };

  const prev = () => {
    const current = currentStep - 1;
    setCurrentStep(current);
  };
  return (
    <BuyerLayout>
      <>
        <Steps current={currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[currentStep].content}</div>
        <div className="steps-action">
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Row justify="center">
              <Button
                type="primary"
                size="large"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            </Row>
          )}
          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </>
      {/* <BuyerRequestCreateComponent /> */}
    </BuyerLayout>
  );
};
export default Page;
