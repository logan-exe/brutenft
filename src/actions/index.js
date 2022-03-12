export const login = () => {
  return {
    type: "LOGIN",
  };
};

export const logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const setLoading = () => {
  return {
    type: "LOADING",
  };
};

export const stopLoading = () => {
  return {
    type: "STOPLOADING",
  };
};

export const setAddress = (address) => {
  return {
    type: "SETADDRESS",
    payload: address,
  };
};
