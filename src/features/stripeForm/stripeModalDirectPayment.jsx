import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, Col, Modal, Row, message } from "antd";
import useResponsiveFontSize from "./useResponsiveFontSize";
import { useMemo } from "react";
import Product from "~/models/product";

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#000",
          fontWeight: 500,
          "::placeholder": {
            color: "#D9E1EC",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize],
  );

  return options;
};

const StripeModalDirectPayment = ({ isStripeModalOpen, handleStripCancel }) => {
  const options = useOptions();
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });
    try {
      await Product.stripeAddCard({
        paymentMethodId: payload.paymentMethod.id,
      });

      message.success("Card Successfully Attached");
      // setIsStripModalOpen(false);
    } catch {
      message.error("Could not save card");
    }
  };
  return (
    <Modal
      okText={"ok"}
      onCancel={handleStripCancel}
      open={isStripeModalOpen}
      title="Stripe Checkout"
      footer={false}
    >
      <form onSubmit={handleSubmit} className="split-form-wrapper">
        <div className="split-form-items" style={{ marginBottom: "20px" }}>
          <label> Card number</label>
          <CardNumberElement
            name="price"
            className="card-input"
            options={{ ...options, showIcon: true }}
            onReady={() => {
              console.log("CardNumberElement [ready]");
            }}
            onChange={(event) => {
              console.log("CardNumberElement [change]", event);
            }}
            onBlur={() => {
              console.log("CardNumberElement [blur]");
            }}
            onFocus={() => {
              console.log("CardNumberElement [focus]");
            }}
          />
        </div>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="split-form-items" style={{ marginBottom: "20px" }}>
              <label>Expiration date </label>
              <CardExpiryElement
                className="card-input"
                options={options}
                onReady={() => {
                  console.log("CardNumberElement [ready]");
                }}
                onChange={(event) => {
                  console.log("CardNumberElement [change]", event);
                }}
                onBlur={() => {
                  console.log("CardNumberElement [blur]");
                }}
                onFocus={() => {
                  console.log("CardNumberElement [focus]");
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="split-form-items">
              <label>CVC</label>
              <CardCvcElement
                className="card-input"
                options={options}
                onReady={() => {
                  console.log("CardNumberElement [ready]");
                }}
                onChange={(event) => {
                  console.log("CardNumberElement [change]", event);
                }}
                onBlur={() => {
                  console.log("CardNumberElement [blur]");
                }}
                onFocus={() => {
                  console.log("CardNumberElement [focus]");
                }}
              />
            </div>
          </Col>
        </Row>
        <div>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            // disabled={!stripe}
          >
            Add Card
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StripeModalDirectPayment;
