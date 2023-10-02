import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import K from "~/utilities/constants";

export default class RoleAndPermission {
  //get product
  static async getAllRoles() {
    const request = new Request(
      K.Network.URL.Roles.GetAllRoles,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {
        // Authorization: `Bearer ${idToken}`,
      },
      false,
      K.Network.ResponseType.Json,
      true,
    );

    const res = await NetworkCall.fetch(request);
    return res;
  }
  static async getAllPermissions(idToken) {
    const request = new Request(
      K.Network.URL.Permission.GetAllPermissions,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {
        Authorization: `Bearer ${idToken}`,
      },
      false,
      K.Network.ResponseType.Json,
      true,
    );

    const res = await NetworkCall.fetch(request);
    return res;
  }

  static async createRole(idToken, data) {
    const request = new Request(
      K.Network.URL.Roles.CreateRole,
      K.Network.Method.POST,
      data,
      K.Network.Header.Type.Json,
      {
        Authorization: `Bearer ${idToken}`,
      },
      false,
      K.Network.ResponseType.Json,
      true,
    );

    const res = await NetworkCall.fetch(request);
    return res;
  }

  static async getRoleById(id, idToken) {
    const request = new Request(
      `${K.Network.URL.Roles.GetRole}?id=${id}`,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {
        Authorization: `Bearer ${idToken}`,
      },
      false,
      K.Network.ResponseType.Json,
      true,
    );
    const res = await NetworkCall.fetch(request);
    console.log("Res in role by id", res);
    return res;
  }
  static async deleteRole(id, data) {
    const request = new Request(
      `${K.Network.URL.Roles.DeleteRole}/${id}`,
      K.Network.Method.DELETE,
      data,
      K.Network.Header.Type.Json,
      {
        // Authorization: `Bearer ${idToken}`,
      },
      false,
      K.Network.ResponseType.Json,
      true,
    );
    const res = await NetworkCall.fetch(request);
    console.log("delete userrole", res);
    return res;
  }

  static async updateRole(idToken, data) {
    const request = new Request(
      K.Network.URL.Roles.UpdateRole,
      K.Network.Method.PUT,
      data,
      K.Network.Header.Type.Json,
      {
        Authorization: `Bearer ${idToken}`,
      },
      false,
      K.Network.ResponseType.Json,
      true,
    );
    console.log("request", request);
    const res = await NetworkCall.fetch(request);
    console.log("res", res);
    return res;
  }
}
