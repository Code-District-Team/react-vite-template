import { Card, Divider, List, Skeleton } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Product from "~/models/product";

export const ProductListView = ({ containerHeight }) => {
  const pageNumber = useRef(0);
  const [data, setData] = useState({ products: [], total: 0 });

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
    <Card className="card-wrapper">
      <div id="scrollableDiv">
        <InfiniteScroll
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
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data.products}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div style={{ fontWeight: 500 }}>
                      <span style={{ fontSize: "1rem" }}>{item.name}</span>
                      <span>
                        <div>Qty: {item.quantity}</div>
                      </span>
                    </div>
                  }
                />
                <p>Price: {item.price}</p>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </Card>
  );
};

ProductListView.propTypes = {
  containerHeight: PropTypes.number,
};

ProductListView.defaultProps = {
  containerHeight: 450,
};
