import { createContext, useReducer } from "react";
import { ContactInfo } from "./Data";

export const Store = createContext();

const initialState = {
  UserInfo: localStorage.getItem("UserInfo")
    ? JSON.parse(localStorage.getItem("UserInfo"))
    : null,
  ContactInfo: localStorage.getItem("ContactInfo")
    ? JSON.parse(localStorage.getItem("ContactInfo"))
    : ContactInfo,
};

function reducer(state, action) {
  switch (action.type) {
    case "ClearUserInfo":
      return { ...state, UserInfo: null };
    case "UserLoggedIn":
      // Store the user info in localStorage and in state
      localStorage.setItem("UserInfo", JSON.stringify(action.payload));
      return { ...state, UserInfo: action.payload };
    case "update":
      return { ...state, UserInfo: action.payload };
    case "ResetUserInfo":
      localStorage.removeItem("UserInfo"); // Also clear from localStorage on reset
      return { ...state, UserInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}> {props.children} </Store.Provider>;
}
