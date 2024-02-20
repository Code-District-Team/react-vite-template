import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import K from "~/utilities/constants";

const stripePromise = loadStripe(K.Stripe.Key);

export default function ElementWrapper({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
