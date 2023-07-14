import User from "~/models/user";
import K from "~/utilities/constants";

export default class Request {
  constructor(
    relativeURL,
    method = K.Network.Method.GET,
    body = null,
    defaultHeaderType = K.Network.Header.Type.Json,
    headers = {},
    isTenant = K.Network.URL.IsMultiTenant,
    responseType = K.Network.ResponseType.Json,
  ) {
    const token = User.getToken();
    const domainPrefix = User.getTenant();
    headers = {
      ...(defaultHeaderType === K.Network.Header.Type.Json
        ? K.Network.Header.Default(token)
        : K.Network.Header.Authorization(token)),
      ...headers,
    };
    this.url = isTenant
      ? K.Network.URL.TenantURL(domainPrefix) + relativeURL
      : K.Network.URL.BaseAPI + relativeURL;
    this.method = method;
    this.body = body;
    this.headers = headers;
    this.responseType = responseType;
  }
}
