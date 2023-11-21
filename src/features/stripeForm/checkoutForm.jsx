import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Modal } from "antd";

export default function CheckoutForm({
  isStripeOwnModalOpen,
  CloseStripeOwnModel,
  parentMessage,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret",
  );
  console.log("client secret", clientSecret);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:8000/products/product-antd",
      },
    });

    if (!error) {
      parentMessage("Payment successfull");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Modal
      okText={"ok"}
      onCancel={CloseStripeOwnModel}
      open={isStripeOwnModalOpen}
      title="Stripe Checkout"
      footer={false}
    >
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {/* {modalMessage && <div id="payment-message">{modalMessage}</div>} */}
      </form>
    </Modal>
  );
}
