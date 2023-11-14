import { message } from "antd";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import User from "~/models/user";
import K from "~/utilities/constants";
import { camelCaseKeys, redirectToUrl } from "~/utilities/generalUtility";

export default class NetworkCall {
  static async fetch(request, useLoading = true) {
    try {
      const response = useLoading
        ? await trackPromise(
            NetworkCall.axios({
              method: request.method,
              url: request.url,
              data: request.body,
              headers: request.headers,
              responseType: request.responseType,
              validateStatus: (status) => {
                return (
                  (status >= 200 && status < 300) ||
                  status === K.Network.StatusCode.NotModified
                );
              },
            }),
          )
        : await NetworkCall.axios({
            method: request.method,
            url: request.url,
            data: request.body,
            headers: request.headers,
            responseType: request.responseType,
            validateStatus: (status) => {
              return (
                (status >= 200 && status < 300) ||
                status === K.Network.StatusCode.NotModified
              );
            },
          });

      console.log("NetworkCall Data: ", response.data);
      return response.data;
    } catch (err) {
      let error = err.response;
      console.log("NetworkCall Error: ", error);
      if (error === undefined) {
        message.error("Cannot connect to server");
        return Promise.reject({
          error: error,
        });
      } else if (error.status === K.Network.StatusCode.Unauthorized) {
        User.logout("User unauthorized");
      } else if (error.status === K.Network.StatusCode.Forbidden) {
        redirectToUrl("/unauthorized");
      } else message.error(error.data.message);

      if ("errors" in error.data)
        error.data.errors = camelCaseKeys(error.data.errors);
      return Promise.reject({
        error: error,
        message: error.data.message,
        statusCode: error.status,
      });
    }
  }
}
NetworkCall.axios = axios.create({
  baseURL: K.Network.URL.BaseAPI,
  timeout: K.Network.Timeout,
  headers: {},
});
