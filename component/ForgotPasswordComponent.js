import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
    userActiveCode,
    userActiveCodeResetter,
    userActiveCodeError
} from "../stores/UserState";
import { compose } from "redux";
import { openNotification } from "../utils";
const FormItem = Form.Item;

const connectToRedux = connect(
    createStructuredSelector({
        userActiveCodeError: userActiveCodeError,
    }),
    (dispatch) => ({
        activeCode: (email) =>
            dispatch(userActiveCode(email)),
        resetData: () => dispatch(userActiveCodeResetter),
    })
);

const enhance = compose(connectToRedux);

const ForgotPasswordComponent = ({ activeCode, userActiveCodeError, resetData }) => {
    const onFinish = (values) => {
        activeCode(values.email);
    };
    useEffect(() => {
        return () => {
            resetData();
        };
    }, [resetData]);

    useEffect(() => {
        if (userActiveCodeError) {
            openNotification("error", { message: userActiveCodeError });
        }
    }, [userActiveCodeError]);

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            autoComplete="new-password"
            onFinish={onFinish}
        >
            <div className="label">
                Please enter your email address and we will send refesh code to you.
                </div>
            <FormItem
                name="email"
                rules={[
                    {
                        required: true,
                        message: "Please enter your Email",
                    },
                ]}
            >
                <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
            </FormItem>

            <FormItem>
                <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                >
                    Next
                </Button>
            </FormItem>
            <FormItem>
                <div className="other">
                    Don't have an account? Sign-up here
                    <br />
                    <Link className="register" href="/register">
                        SIGN-UP
                    </Link>
                </div>
            </FormItem>
        </Form>
    );
};
export default enhance(ForgotPasswordComponent);
