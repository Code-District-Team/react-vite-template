import { Button, Card, Typography, message } from "antd";
import { useEffect, useState } from "react";
import ElementWrapper from "../stripeForm/wrapper";
import StripeModalWithSaveCard from "../stripeForm/stripeModalWithSaveCard";
import {
  CreditCardOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
const { Title } = Typography;
import "./cardDisplay.css"; // Make sure to create this CSS file
import Product from "~/models/product";

const Billing = () => {
  const [isStripeCardModalOpen, setIsStripeCardModalOpen] = useState(false);
  const [cardLastFour, setCardLastFour] = useState(null);

  const getStripePaymentMethod = async () => {
    try {
      const response = await Product.getStripePaymentMethod({});

      setCardLastFour(response?.data[0]?.card?.last4);
    } catch {
      message.error("stripe payment not working");
    }
  };

  const deleteStripeCard = async () => {
    try {
      await Product.deleteCard({});
      setCardLastFour(null);
    } catch {
      message.error("Could not delete card");
    }
  };

  const showStripeModal = () => {
    setIsStripeCardModalOpen(true);
  };

  const handleStripeCancel = () => {
    setIsStripeCardModalOpen(false);
  };

  const handleEditCard = () => {
    // Logic for editing card
    showStripeModal();
  };

  useEffect(() => {
    getStripePaymentMethod();
  }, []);

  return (
    <>
      <Title level={5}>Card Information</Title>
      <div>Your billing would be processed through the following card.</div>
      <div>
        {!cardLastFour ? (
          <Button type="link" className="p-0" onClick={showStripeModal}>
            Add New Card
          </Button>
        ) : (
          <Card className="card-display">
            <CreditCardOutlined className="card-icon" />
            <span className="card-number">xxxx xxxx xxxx {cardLastFour}</span>
            <Button type="link" onClick={handleEditCard}>
              <EditOutlined />
            </Button>
            <Button type="link" onClick={deleteStripeCard}>
              <DeleteOutlined />
            </Button>
          </Card>
        )}

        <ElementWrapper>
          <StripeModalWithSaveCard
            isStripeModalOpen={isStripeCardModalOpen}
            handleStripCancel={handleStripeCancel}
            setCardLastFour={setCardLastFour}
            setIsStripeCardModalOpen={setIsStripeCardModalOpen}
          />
        </ElementWrapper>
      </div>
    </>
  );
};

export default Billing;
