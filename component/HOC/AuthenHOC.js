import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import React from "react";

import {
  CurrentUserData,
  getCurrentUser,
  verifyScopeAndRole,
  CurrentUserError,
} from "../../stores/UserState";
import { isServer } from "../../utils";
import { Row, Spin } from "antd";
import { flow, nth, split } from "lodash/fp";
import Router from "next/router";

const connectWithRedux = connect(
  createStructuredSelector({
    currentUser: CurrentUserData,
    currentUserError: CurrentUserError,
  })
);

const getScopeByUrl = flow(split("/"), nth(1));

function withAuth(AuthComponent) {
  class AuthenHOC extends React.Component {
    static getInitialProps = async (ctx) => {
      return AuthComponent.getInitialProps
        ? AuthComponent.getInitialProps(ctx)
        : {};
    };

    componentDidMount() {
      console.log(this.props.currentUserError);
      console.log(this.props.currentUser);
      if (!isServer) {
        const scope = getScopeByUrl(Router.pathname);
        this.props.dispatch(getCurrentUser({ scope }));
      }
    }

    render() {
      const { currentUser } = this.props;
      const scope = isServer ? null : getScopeByUrl(Router.pathname);
      return (
        <div>
          {currentUser && verifyScopeAndRole(scope, currentUser.role) ? (
            <AuthComponent {...this.props} isLoggedIn={true} />
          ) : (
            <Row justify="center" style={{ height: "100vh" }} align="middle">
              <Spin size="large" />
            </Row>
          )}
        </div>
      );
    }
  }

  return connectWithRedux(AuthenHOC);
}

export default withAuth;
