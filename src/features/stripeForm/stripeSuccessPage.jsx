import { Card } from "antd";
import { Link } from "react-router-dom";

const StripeSuccessPage = () => {
  return (
    <Card>
      <div> Stripe Payment SucccessFul</div>
      <div>
        <Link to="/products/product-antd">Continue Shopping</Link>
      </div>
    </Card>
  );
};

export default StripeSuccessPage;
