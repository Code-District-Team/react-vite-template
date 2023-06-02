import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import K from "~/utilities/constants";
export default class userList {
  static async getUserList(params = {}) {
    const request = new Request(
      K.Network.URL.userList.getUsers,
      K.Network.Method.POST,
      params,
      K.Network.Header.Type.Json,
      {},
      false
    );
    return await NetworkCall.fetch(request);
  }
}
