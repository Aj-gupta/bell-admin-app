import { SET_USER_DETAILS, SET_CLIENT_DETAILS } from "./user.actiontype";

export const initialState = {
  user_details: null,
  client_details: null, //For Admin Only
};

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        user_details: action.payload,
      };
    //For Admin Only
    case SET_CLIENT_DETAILS:
      return {
        ...state,
        client_details: action.payload,
      };
  }
};

export default userReducer;
