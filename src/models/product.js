import NetworkCall from "~/network/networkCall";
import Request from "~/network/request";
import K from "~/utilities/constants";

export default class Product {
  //get product
  static async getByFilters(body) {
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

  static async getAll() {
    const request = new Request(
      K.Network.URL.Products.GetAll,
      K.Network.Method.GET,
      null,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }

  //get product by id
  static async getById(id) {
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
  static async create(body) {
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

  static async update(id, body) {
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

  static async delete(id) {
    const params = `${K.Network.URL.Products.DeleteProducts}/${id}`;
    const request = new Request(
      params,
      K.Network.Method.DELETE,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }

  // Export Csv File
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

  // Stripe Add Card
  static async stripeAddCard(body) {
    const request = new Request(
      K.Network.URL.Stripe.AddCard,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.File,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }

  // Stripe Payment Method
  static async  getStripePaymentMethod() {
    const request = new Request(
      K.Network.URL.Stripe.GetPaymentMethods,
      K.Network.Method.GET,
      K.Network.Header.Type.File,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }


   // Stripe Verify Payment
   static async  stripeVerifyPayment(id, client_secret, status) {
    const url = `?payment_intent=${id}&payment_intent_client_secret=${client_secret}&redirect_status=${status}`
    const request = new Request(
      K.Network.URL.Stripe.VerifyPayment + url,
      K.Network.Method.GET,
      K.Network.Header.Type.File,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
  // Stripe Deduct Amount
  static async stripeDeductAmount(body) {
    const request = new Request(
      K.Network.URL.Stripe.Buy,
      K.Network.Method.POST,
      body,
      K.Network.Header.Type.File,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }
 // Stripe Create Payment Intent
 static async stripeCreatePaymentIntent(body) {
  const request = new Request(
    K.Network.URL.Stripe.CreatePaymentIntent,
    K.Network.Method.POST,
    body,
    K.Network.Header.Type.Json,
    {},
    false,
  );
  return await NetworkCall.fetch(request, true);
}
  CreatePaymentIntent

  // Stripe Delete Card
  static async deleteCard() {
    const request = new Request(
      K.Network.URL.Stripe.DeleteCard,
      K.Network.Method.DELETE,
      K.Network.Header.Type.Json,
      {},
      false,
    );
    return await NetworkCall.fetch(request, true);
  }

  
}
