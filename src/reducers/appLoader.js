const appLoaderReducer = (state = true, action) => {
  switch (action.type) {
    case "LOADING":
      return state;
    case "STOPLOADING":
      return false;
    default:
      return state;
  }
};

export default appLoaderReducer;
