import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import K from "~/utilities/constants";

export default class RoleAndPermission {
  //get product
  static async getAllRoles() {
    const request = new Request(
      K.Network.URL.Roles,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      false,
      K.Network.ResponseType.Json,
      true,
    );

    const res = await NetworkCall.fetch(request);
    return res;
  }
  static async getAllPermissions() {
    const request = new Request(
      K.Network.URL.Permission,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      false,
      K.Network.ResponseType.Json,
      true,
    );

    const res = await NetworkCall.fetch(request);
    return res;
  }

  static async createRole(data) {
    const request = new Request(
      K.Network.URL.Roles,
      K.Network.Method.POST,
      data,
      K.Network.Header.Type.Json,
      {},
      false,
      K.Network.ResponseType.Json,
      true,
    );

    const res = await NetworkCall.fetch(request);
    return res;
  }

  static async getRoleById(id) {
    const request = new Request(
      K.Network.URL.Roles + `/${id}`,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      false,
      K.Network.ResponseType.Json,
      true,
    );
    const res = await NetworkCall.fetch(request);
    return res;
  }
  static async deleteRole(id, body) {
    const request = new Request(
      K.Network.URL.Roles + `/${id}`,
      K.Network.Method.DELETE,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
      K.Network.ResponseType.Json,
      true,
    );
    const res = await NetworkCall.fetch(request);
    return res;
  }

  static async updateRole(id, body) {
    const request = new Request(
      K.Network.URL.Roles + `/${id}`,
      K.Network.Method.PATCH,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
      K.Network.ResponseType.Json,
      true,
    );
    const res = await NetworkCall.fetch(request);
    return res;
  }
}
