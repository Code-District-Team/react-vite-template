import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import { saveUserData } from "~/redux/user/userSlice";
import K from "~/utilities/constants";
import { redirectToLogin } from "~/utilities/generalUtility";

export default class User {
  // API call using thunk.
  static loginCall(email, password, remember) {
    const body = {
      email,
      password,
    };
    // * Request Instance
    const request = new Request(
      K.Network.URL.Auth.Login,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    return async (dispatch) => {
      const user = await NetworkCall.fetch(request);
      let encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        K.Cookie.Key.EncryptionKey,
      );

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

  static async signUpCall(
    firstName,
    lastName,
    mobilePhone,
    email,
    password,
    remember,
  ) {
    const body = {
      firstName,
      lastName,
      mobilePhone,
      email,
      password,
    };
    // * Request Instance
    const request = new Request(
      K.Network.URL.Auth.SignUp,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    const user = await NetworkCall.fetch(request);
    let encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      K.Cookie.Key.EncryptionKey,
    );
    Cookies.set(K.Cookie.Key.User, encryptedUser, {
      path: "/",
      domain: K.Network.URL.Client.BaseHost,
      expires: remember ? 365 : "",
    });

    return user;
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
    const body = {
      email,
    };
    const request = new Request(
      K.Network.URL.Auth.ForgotPassword,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    const user = await NetworkCall.fetch(request);
    return user;
  }

  static resetPassword(password, token, remember) {
    const body = {
      password,
    };
    const request = new Request(
      K.Network.URL.Auth.ResetPassword + "/" + token,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    return async () => {
      const user = await NetworkCall.fetch(request, true);
      let encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        K.Cookie.Key.EncryptionKey,
      );
      Cookies.set(K.Cookie.Key.User, encryptedUser, {
        path: "/",
        domain: K.Network.URL.Client.BaseHost,
        expires: remember ? 365 : "",
      });
      return user;
    };
  }

  static async changePassword(oldPassword, newPassword) {
    const body = {
      oldPassword,
      newPassword,
    };
    const request = new Request(
      K.Network.URL.Auth.ChangePassword,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    const res = await NetworkCall.fetch(request, true);
    return res;
  }

  // get Profile data
  static async profileData() {
    const request = new Request(
      K.Network.URL.Users.LoggedInUserDetails,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    return await NetworkCall.fetch(request, true);
  }

  static async userData() {
    const request = new Request(
      K.Network.URL.Users.GetUser,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      { "ngrok-skip-browser-warning": true },
      false,
    );

    return NetworkCall.fetch(request, true);
  }

  static async deleteUser(id) {
    const request = new Request(
      K.Network.URL.Users.DeleteUser + `?id=${id}`,
      K.Network.Method.DELETE,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    return NetworkCall.fetch(request, true);
  }
  //Update Profile Data
  static async updateProfileData(body, remember) {
    const request = new Request(
      K.Network.URL.Users.UpdateProfileData,
      K.Network.Method.PUT,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    const user = await NetworkCall.fetch(request, true);
    const data = User.getUserObjectFromCookies();
    console.log("hsbData", data);
    user.roles = data.user.roles;
    const cookieData = {
      apiToken: data?.apiToken,
      user,
    };
    let encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(cookieData),
      K.Cookie.Key.EncryptionKey,
    );
    Cookies.set(K.Cookie.Key.User, encryptedUser, {
      path: "/",
      domain: K.Network.URL.Client.BaseHost,
      expires: remember ? 365 : "",
    });

    return user;
  }
  // Invite User
  static async InviteUser(email, roleId) {
    const body = {
      email,
      roleId,
    };
    const request = new Request(
      K.Network.URL.Users.InviteUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );

    return NetworkCall.fetch(request, true);
  }
  // get all Roles
  static async GetUserRoles() {
    const request = new Request(
      K.Network.URL.Roles,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      { "ngrok-skip-browser-warning": true },
      false,
    );

    return NetworkCall.fetch(request, true);
  }

  // Upload Profile Picture
  static async UploadProfilePicture(body, remember) {
    const request = new Request(
      K.Network.URL.Users.UploadProfilePicture,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.File,
      {},
      false,
    );
    const result = await NetworkCall.fetch(request, true);
    let data = User.getUserObjectFromCookies();
    console.log("data before", data.user.profileImageUrl);
    data.user.profileImageUrl = result.path;
    console.log("data after", data.user.profileImageUrl);
    const cookieData = {
      apiToken: data?.apiToken,
      user: data.user,
    };
    let encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(cookieData),
      K.Cookie.Key.EncryptionKey,
    );
    Cookies.set(K.Cookie.Key.User, encryptedUser, {
      path: "/",
      domain: K.Network.URL.Client.BaseHost,
      expires: remember ? 365 : "",
    });
    return result;
  }

  // * Helpers

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

  static getId() {
    return this.getUserObjectFromCookies().user?.id ?? "";
  }

  static getToken() {
    return this.getUserObjectFromCookies().apiToken ?? "";
  }

  static getFullName() {
    const { firstName, lastName } = this.getUserObjectFromCookies();
    return firstName?.concat(" ", lastName) ?? "";
  }

  static getEmail() {
    return this.getUserObjectFromCookies().email ?? "";
  }

  static getTenant() {
    return this.getUserObjectFromCookies().tenant?.domainPrefix ?? "";
  }
  static getRole() {
    return this.getUserObjectFromCookies()?.user?.roles ?? null;
  }
}
