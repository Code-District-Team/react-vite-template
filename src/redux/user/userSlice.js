import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: "",
  permissionsHash: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.userDetails = action.payload;
    },
    setPermissionsHash: (state, action) => {
      // * Generate Permissions Hash
      const hashed = [];
      action.payload.forEach((role) => {
        role.permissions.forEach(({ code, name }) => {
          hashed.push([code, name]);
        });
      });
      state.permissionsHash = new Map(hashed);

      /**
       * In case you are using redux persist do not store Map type object
       * Only store array in redux
       * Create Map instance from hash before using in isPermissionPresent()
       * See Redux Docs: https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
       */
    },
  },
});

export const { saveUserData, setPermissionsHash } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
