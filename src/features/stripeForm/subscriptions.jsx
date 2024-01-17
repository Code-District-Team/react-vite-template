import { Card } from "antd";

const Subscriptions = () => {
  return (
    <>
      <Card title="Products Subscription">
        <stripe-buy-button
          buy-button-id="buy_btn_1OFDs6G9aw8LuACQ2E11QNUr"
          publishable-key="pk_test_51O2UHMG9aw8LuACQpfTv0d5ruJjE7NbLmpRcm1DzIZH3l5Tkcq0P17PYazWkKjm08aBcTqh3sZhZtL67ErqrncpK00llOIE5F3"
        ></stripe-buy-button>
        <stripe-buy-button
          buy-button-id="buy_btn_1OFE22G9aw8LuACQNA79QSKr"
          publishable-key="pk_test_51O2UHMG9aw8LuACQpfTv0d5ruJjE7NbLmpRcm1DzIZH3l5Tkcq0P17PYazWkKjm08aBcTqh3sZhZtL67ErqrncpK00llOIE5F3"
        ></stripe-buy-button>
        <stripe-buy-button
          buy-button-id="buy_btn_1OFE3LG9aw8LuACQbfSWKT9T"
          publishable-key="pk_test_51O2UHMG9aw8LuACQpfTv0d5ruJjE7NbLmpRcm1DzIZH3l5Tkcq0P17PYazWkKjm08aBcTqh3sZhZtL67ErqrncpK00llOIE5F3"
        ></stripe-buy-button>
      </Card>
    </>
  );
};

export default Subscriptions;
