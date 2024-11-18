"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { LOCAL_STORAGE_USER_DETAILS } from "@/lib/constant";
import { SET_USER_DETAILS } from "@/lib/context/user_context/user.actiontype";

export const StateContext = createContext();

export const UserDetailStateProvider = ({
  reducer,
  initialState,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedUserData = localStorage.getItem(LOCAL_STORAGE_USER_DETAILS);
    if (
      storedUserData &&
      storedUserData !== "undefined" &&
      storedUserData !== "null"
    ) {
      dispatch({ type: SET_USER_DETAILS, payload: JSON.parse(storedUserData) });
    }
  }, []);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useUserDetail = () => useContext(StateContext);
