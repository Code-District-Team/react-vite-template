import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import K from "~/utilities/constants";

export default class Product {
  //get product
  static async getProductData(body) {
    const request = new Request(
      K.Network.URL.Products.GetProducts,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }

  //get product by id
  static async getProductDataById(id) {
    const request = new Request(
      K.Network.URL.Products.GetProductsById + `/${id}`,
      K.Network.Method.GET,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  // Create Product
  static async createProductData(name, quantity, price) {
    const body = {
      name,
      quantity,
      price,
    };
    const request = new Request(
      K.Network.URL.Products.CreateProducts,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  static async updateProductData(name, quantity, price, id) {
    const body = {
      name,
      quantity,
      price,
    };
    const request = new Request(
      K.Network.URL.Products.UpdateProducts + `/${id}`,
      K.Network.Method.PATCH,
      body,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  static async deleteProductData(id) {
    const params = `${K.Network.URL.Products.DeleteProducts}/${id}`;
    const request = new Request(
      params,
      K.Network.Method.DELETE,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);

    // Export Csv File
  }
  static async exportCsvFile(body) {
    const request = new Request(
      K.Network.URL.Csv.ExportCsvFile,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.File,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  // Import Csv File
  static async importCsvFile(body) {
    const request = new Request(
      K.Network.URL.Csv.ImportCsvFile,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.File,
      {},
      false,
    );

    return NetworkCall.fetch(request, true);
  }
}
