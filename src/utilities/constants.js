const K = {
  Network: {
    URL: {
      Base: import.meta.env.VITE_BASE_URL,
      BaseAPI: import.meta.env.VITE_BASE_API_URL,
      DomainName: import.meta.env.VITE_CLIENT_DOMAIN_NAME,
      Timeout: import.meta.env.VITE_TIMEOUT,
      Protocol: import.meta.env.VITE_CLIENT_PROTOCOL,
      IsMultiTenant: import.meta.env.VITE_IS_MULTI_TENANT === "true", // * Converting into boolean
      TenantURL: (domainPrefix = "") => {
        return (
          import.meta.env.VITE_CLIENT_PROTOCOL +
          "://" +
          domainPrefix +
          import.meta.env.VITE_TENANT_PARTIAL_URL
        );
      },
      Client: {
        BaseHost: import.meta.env.VITE_CLIENT_BASE_HOST,
        BasePort: import.meta.env.VITE_CLIENT_BASE_PORT,
      },

      Auth: {
        Login: "/auth/signin",
        SignUp: "/auth/signup",
        ResetPassword: "/auth/reset-password",
        ForgotPassword: "/auth/forget-password",
        ChangePassword: "/auth/change-password",
      },
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
    ResponseType: { Blob: "blob", Json: "json" },
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
  Permissions: {
    Admin: "Admin",
    User: "User",
  },
};
export default K;
