import { Card, Divider, List, Skeleton } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Product from "~/models/product";

export const ProductGridView = ({ containerHeight }) => {
  const [data, setData] = useState({ products: [], total: 0 });
  const pageNumber = useRef(0);

  const fetchProductDetails = async () => {
    try {
      pageNumber.current = pageNumber.current + 1;
      const payload = {
        page: pageNumber.current,
        limit: 6,
        filterType: "antd",
      };
      const response = await Product.getByFilters(payload);
      setData((prevData) => ({
        products: [...prevData.products, ...response.data.products],
        total: response.data.total,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div id="scrollableDiv">
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        height={containerHeight}
        dataLength={data.products?.length || 0} // Safely access the length
        next={fetchProductDetails}
        hasMore={data.products?.length < data.total} // Compare against the total value
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      >
        <List
          grid={{ column: 3, gutter: 16 }}
          dataSource={data.products}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card title={item.name}>
                <List.Item.Meta />
                <p>Qty: {item.quantity}</p>
                <p>Price: {item.price}</p>
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

ProductGridView.propTypes = {
  containerHeight: PropTypes.number,
};

ProductGridView.defaultProps = {
  containerHeight: 450,
};
