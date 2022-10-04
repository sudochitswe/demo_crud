const authenticate = 'AUTHENTICATE';
const initialState = { userKey: 0, isforceToChangePW: 0, isAuthenticated: false, loginID: '', displayName: '', features: [] };

export const actionCreators = {
  authenticate: userCredential => ({ type: authenticate, payload: userCredential }),
};

export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case authenticate:
      return action.payload;
    default:
      return state;
  }
};