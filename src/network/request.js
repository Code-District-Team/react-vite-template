import K from "utilities/constants";
import User from "models/user/user";

export default class Request {
  constructor(
    relativeURL,
    method = K.Network.Method.GET,
    body = null,
    defaultHeaderType = K.Network.Header.Type.Json,
    headers = {}
  ) {
    const token = User.getToken();
    headers = {
      ...(defaultHeaderType === K.Network.Header.Type.Json
        ? K.Network.Header.Default(token)
        : K.Network.Header.Authorization(token)),
      ...headers,
    };
    this.url = K.Network.URL.BaseAPI + relativeURL;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }

  // User calls.
  static loginUser(email, password) {
    const body = {
      email,
      password,
    };
    return new Request(
      K.Network.URL.LoginUser,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static forgotPassword(email) {
    const body = {
      email,
    };
    return new Request(
      K.Network.URL.ForgotPassword,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }

  static resetPassword(password, token) {
    const body = {
      password,
      token,
    };
    return new Request(
      K.Network.URL.ResetPassword,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {}
    );
  }
}
