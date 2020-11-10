import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
    userUpdatePasswordByCode,
    userUpdatePasswordByCodeResetter,
    userUpdatePasswordByCodeError
} from "../stores/UserState";
import { compose } from "redux";
import { openNotification } from "../utils";
import { useRouter } from "next/router";
const FormItem = Form.Item;

const connectToRedux = connect(
    createStructuredSelector({
        userUpdateError: userUpdatePasswordByCodeError,
    }),
    (dispatch) => ({
        updatePassword: ({email,password,code}) =>
            dispatch(userUpdatePasswordByCode({email,password,code})),
        resetData: () => dispatch(userUpdatePasswordByCodeResetter),
    })
);

const enhance = compose(connectToRedux);

const RefreshPasswordComponent = ({ updatePassword, userUpdateError, resetData }) => {
    const router = useRouter();
    const email = router.query.email;
    const onFinish = (values) => {
        let object = {email:email,password:values.newPassword,code:values.activeCode};
        console.log(object);
        updatePassword(object);
    };
    useEffect(() => {
        return () => {
            resetData();
        };
    }, [resetData]);

    useEffect(() => {
        if (userUpdateError) {
            openNotification("error", { message: userUpdateError });
        }
    }, [userUpdateError]);

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
            <div className="label" style={{ color: "green" }}>
                We sent an email with Refesh Code to your account!
                </div>
            <br />
            <div className="label" >
                <span style={{ color: "red" }}>*</span> Code
                </div>
            <FormItem
                name="activeCode"
                rules={[
                    {
                        required: true,
                        message: "Please enter your active code",
                    },
                ]}
            >
                <Input size="large" prefix={<UserOutlined />} placeholder="Type your code received from your email" />
            </FormItem>
            <div className="label" >
                <span style={{ color: "red" }}>*</span> New Password
                </div>
            <FormItem
                name="newPassword"
                rules={[
                    {
                        required: true,
                        message: "Please enter your new password",
                    },
                ]}
            >
                <Input size="large" prefix={<UserOutlined />} placeholder="Type your password" />
            </FormItem>
            <div className="label" >
                <span style={{ color: "red" }}>*</span> Re-password
                </div>
            <FormItem
                name="rePassword"
                rules={[
                    {
                        required: true,
                        message: "Please enter your re-password",
                    },
                ]}
            >
                <Input size="large" prefix={<UserOutlined />} placeholder="Type your password again" />
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
export default enhance(RefreshPasswordComponent);
