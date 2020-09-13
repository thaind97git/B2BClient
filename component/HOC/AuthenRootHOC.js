import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import React from "react";

import {
  currentUserSelector,
  getUser,
  verifyScopeAndRole,
} from "../../stores/UserState";
import { isServer } from "../../utils";
import ServerInfoHOC from "./ServerInfoHOC";
import { compose } from "recompose";

// const connectWithRedux = connect(
//   createStructuredSelector({
//     currentUser: currentUserSelector,
//   })
// );

// const enhance = compose(ServerInfoHOC, connectWithRedux);

export default function withAuth(AuthComponent) {
  class AuthenRootHOC extends React.Component {
    static getInitialProps = async (ctx) => {
      return AuthComponent.getInitialProps
        ? AuthComponent.getInitialProps(ctx)
        : {};
    };

    componentDidMount() {
      if (!isServer) {
        this.props.dispatch(getUser());
      }
    }

    render() {
      const { currentUser } = this.props;

      return (
        <div>
          {false ? (
            "Loading"
          ) : (
            <AuthComponent {...this.props} isLoggedIn={true} />
          )}
        </div>
      );
    }
  }

  return AuthenRootHOC;
}
