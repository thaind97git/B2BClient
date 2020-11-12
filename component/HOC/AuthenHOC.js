import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import React from "react";

import {
  CurrentUserData,
  getCurrentUser,
  verifyScopeAndRole,
  CurrentUserError,
  CurrentUserResetter,
} from "../../stores/UserState";
import { isServer } from "../../utils";
import { Row, Spin } from "antd";
import { flow, nth, split } from "lodash/fp";
import Router from "next/router";

const connectWithRedux = connect(
  createStructuredSelector({
    currentUser: CurrentUserData,
    currentUserError: CurrentUserError,
  }),
  (dispatch) => ({
    resetData: () => dispatch(CurrentUserResetter),
    getCurrentUser: ({ scope }) => dispatch(getCurrentUser({ scope })),
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
      if (!isServer) {
        const scope = getScopeByUrl(Router.pathname);
        this.props.getCurrentUser({ scope });
      }
    }

    componentDidUpdate() {
      if (this.props.currentUserError) {
        Router.push(
          `/login?returnUrl=${Router.pathname}${window.location.search}`
        );
      }
    }

    componentWillUnmount() {
      if (this.props.currentUserError) {
        this.props.resetData();
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
