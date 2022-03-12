import { combineReducers } from "redux";
import appLoaderReducer from "./appLoader";
import setAddress from "./setAddress";

const allReducers = combineReducers({
  appLoader: appLoaderReducer,
  setAddress: setAddress,
});

export default allReducers;
