import { ACTIONS } from 'redux-api-call';

const ROOT = '__reaction__';
const ON_SUCCESS = '__on_success';
const ON_FAILURE = '__on_failure';

export const middleware = store => next => action => {
  next(action);
  if (
    action.type === ACTIONS.COMPLETE &&
    action.payload[ROOT] &&
    typeof action.payload[ROOT][ON_SUCCESS] === 'function'
  ) {
    action.payload[ROOT][ON_SUCCESS](action.payload.json, action.meta, store);
  }

  if (
    action.type === ACTIONS.FAILURE &&
    action.payload[ROOT] &&
    typeof action.payload[ROOT][ON_FAILURE] === 'function'
  ) {
    action.payload[ROOT][ON_FAILURE](action.payload.json, action.meta, store);
  }
};

export const respondToSuccess = (action, handler) => {
  const payload = { ...action.payload };

  if (!payload[ROOT]) {
    payload[ROOT] = {};
  }

  Object.defineProperty(payload[ROOT], ON_SUCCESS, {
    value: handler,
    writable: false
  });
  return { ...action, payload };
};

export const respondToFailure = (action, handler) => {
  const payload = { ...action.payload };

  if (!payload[ROOT]) {
    payload[ROOT] = {};
  }

  Object.defineProperty(payload[ROOT], ON_FAILURE, {
    value: handler,
    writable: false
  });

  return { ...action, payload };
};
