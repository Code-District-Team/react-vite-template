const K = {
  Network: {
    URL: {
      // Development
      Base: import.meta.env.VITE_BASE_URL,
      BaseAPI: import.meta.env.VITE_BASE_API_URL,
      DomainName: import.meta.env.VITE_CLIENT_DOMAIN_NAME,
      Timeout: import.meta.env.VITE_TIMEOUT,
      Protocol: import.meta.env.VITE_PROTOCOL,
      Client: {
        BaseHost: import.meta.env.VITE_CLIENT_BASE_HOST,
        BasePort: import.meta.env.VITE_CLIENT_BASE_PORT,
      },

      // Assignment
      LoginUser: "/auth/signin",

      // Forget password
      ForgotPassword: "/user/send_password_reset_token",

      //Reset password
      ResetPassword: "/user/reset_password",
    },
    Method: {
      GET: "GET",
      PUT: "PUT",
      POST: "POST",
      PATCH: "PATCH",
      DELETE: "DELETE",
    },
    Header: {
      ContentType: "Content-Type",
      ApplicationJson: "application/json",
      Default: (token = "") => ({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      }),
      Authorization: (token = "") => ({
        Authorization: "Bearer " + token,
      }),
      Type: {
        Json: "json",
        File: "file",
      },
    },
    StatusCode: {
      NotModified: 304,
      Unauthorized: 401,
      Forbidden: 403,
      NotFound: 404,
      InternalServerError: 500,
    },
  },
  Cookie: {
    Key: {
      User: "user",
      EncryptionKey: "logged_in_user",
    },
  },
  Roles: {
    Admin: "Admin",
    User: "User",
  },
};
export default K;
