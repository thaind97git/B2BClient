import { ACTIONS } from 'redux-api-call';

import { flow, includes, map, path, some } from 'lodash/fp';

import { REFRESH_TOKEN_API, refreshToken } from '../stores/UserState';

const resetActionToStart = ({ type, payload }, resp) => {
  if (!type || !payload) {
    return;
  }
  const newAction = { type: type, payload: { ...payload } };
  newAction.type = ACTIONS.START;
  newAction.payload.headers.Authorization = resp.token;

  return newAction;
};

const awaitingToRedispatchActions = [];

const verifyExpiredJWT = flow(
  path('json.errors'),
  map('message'),
  some(includes('jwt expired'))
);

export default store => next => action => {
  next(action);
  if (action.type === ACTIONS.FAILURE && verifyExpiredJWT(action.payload)) {
    if (!awaitingToRedispatchActions.length) {
      store.dispatch(refreshToken());
    }

    awaitingToRedispatchActions.push(action);
  } else if (
    action.type === ACTIONS.COMPLETE &&
    action.payload.name === REFRESH_TOKEN_API
  ) {
    const resp = action.payload.json || {};
    if (!resp.success) {
      return;
    }

    while (awaitingToRedispatchActions.length) {
      const awaitingAction = resetActionToStart(
        awaitingToRedispatchActions.shift(),
        resp
      );

      awaitingAction && store.dispatch(awaitingAction);
    }
  }
};
