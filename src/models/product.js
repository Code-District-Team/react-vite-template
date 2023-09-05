import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import K from "~/utilities/constants";

export default class Product {
  //get product
  static async getProductData(queryParams) {
    const params = `${K.Network.URL.Products.GetProducts}?${queryParams}`;
    const request = new Request(
      params,
      K.Network.Method.GET,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  static async createProductData() {
    const request = new Request(
      K.Network.URL.Products.GetProducts,
      K.Network.Method.POST,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  static async updateProductData() {
    const request = new Request(
      K.Network.URL.Products.GetProducts,
      K.Network.Method.PATCH,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  static async deleteProductData() {
    const request = new Request(
      K.Network.URL.Products.GetProducts,
      K.Network.Method.DELETE,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
}
