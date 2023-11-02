import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, Row, Col } from "antd";
import { useMemo } from "react";
import useResponsiveFontSize from "./useResponsiveFontSize";
// import StripeModel from "models/stripeModel";
// import { useDispatch } from "react-redux";
// import { setPaymentInfoAttached } from "redux/userSlice";
import Modal from "antd/es/modal/Modal";

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

export default function SplitForm({ isStripeModalOpen }) {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  // const dispatch = useDispatch();

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
    console.log("[PaymentMethod]", payload);
    try {
      const response = await StripeModel.savePaymentMethod({
        paymentMethodId: payload.paymentMethod.id,
      });
      setCard({
        last4: response.paymentMethod.card.last4,
        brand: response.paymentMethod.card.brand,
      });
      dispatch(setPaymentInfoAttached(response.tenant.isPaymentMethodAttached));
      message.success("Card Successfully Attached");
      setIsStripModalOpen(false);
    } catch {
      message.error("Could not save card");
    }
  };

  return (
    <>
      <Modal open={isStripeModalOpen}>
        <form onSubmit={handleSubmit} className="split-form-wrapper">
          {/* Can be done without form */}
          <div className="split-form-items">
            <label> Card number</label>
            <CardNumberElement
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
              <div className="split-form-items">
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
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            disabled={!stripe}
          >
            Add Card
          </Button>
        </form>
      </Modal>
    </>
  );
}
