import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import NetworkCall from "network/networkCall";
import K from "~/utilities/constants";
import { redirectToLogin } from "~/utilities/generalUtility";
import { saveUserData } from "~/redux/user/userSlice";

export default class User {
  // API call using thunk.
  static loginCall(email, password, remember) {
    return async (dispatch) => {
      const user = await NetworkCall.fetch(Request.loginUser(email, password));
      let encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        K.Cookie.Key.EncryptionKey
      );
      console.log(encryptedUser);
      Cookies.set(K.Cookie.Key.User, encryptedUser, {
        path: "/",
        domain: K.Network.URL.Client.BaseHost,
        expires: remember ? 365 : "",
      });

      // * here we can store loggedIn user date to redux store
      dispatch(saveUserData(user));

      return user;
    };
  }

  static logoutCall(error = "") {
    Cookies.remove(K.Cookie.Key.User, {
      path: "/",
      domain: K.Network.URL.Client.BaseHost,
    });
    redirectToLogin(error);
  }

  //Forgot password
  static async forgotPassword(email) {
    const user = await NetworkCall.fetch(Request.forgotPassword(email));
    console.log("User: ", user);
    return user;
  }

  //Reset password
  static resetPassword(newPassword, token, remember) {
    return async () => {
      const user = await NetworkCall.fetch(
        Request.resetPassword(newPassword, token),
        true
      );
      let encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        K.Cookie.Key.EncryptionKey
      );
      console.log(encryptedUser);
      Cookies.set(K.Cookie.Key.User, encryptedUser, {
        path: "/",
        domain: K.Network.URL.Client.BaseHost,
        expires: remember ? 365 : "",
      });
      return user;
    };
  }

  // Selectors

  // Helpers
  static getUserObjectFromCookies() {
    let cookieUser = Cookies.get(K.Cookie.Key.User);
    let bytes = cookieUser
      ? CryptoJS.AES.decrypt(cookieUser, K.Cookie.Key.EncryptionKey)
      : "{}";
    try {
      let utfBytes = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(utfBytes);
    } catch (error) {
      console.log("error", error);
      return this.logoutCall("User unauthorized");
    }
  }

  static isTokenAvailable() {
    return this.getUserObjectFromCookies().apiToken ? true : false;
  }

  static getToken() {
    return this.getUserObjectFromCookies().apiToken ?? "";
  }

  static getName() {
    return this.getUserObjectFromCookies().name ?? "";
  }

  static getEmail() {
    return this.getUserObjectFromCookies().email ?? "";
  }
}
