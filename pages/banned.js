import React, { useEffect } from 'react';
import Link from 'next/link';
import Exception from '../component/Exception';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  CurrentUserError,
  getCurrentUser,
  userLoginDataErrorSelector
} from '../stores/UserState';
const connectToRedux = connect(
  createStructuredSelector({
    userLoginError: userLoginDataErrorSelector,
    seftError: CurrentUserError
  }),
  (dispatch) => ({
    getCurrentUser: () => dispatch(getCurrentUser({}))
  })
);
const Exception500 = ({ seftError, getCurrentUser }) => {
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);
  let message =
    'Your account have been banned. Please contact support for help.';
  if (seftError && (seftError?.errorMessage || '').includes('banned')) {
    message = seftError;
  }
  return (
    <Exception
      type="403"
      desc={`Sorry, ${message}`}
      linkElement={Link}
      backText="Back to home"
    />
  );
};

export default connectToRedux(Exception500);
