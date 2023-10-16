import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, List, Skeleton, Typography } from "antd";
import Card from "antd/es/card/Card";
import Product from "~/models/product";

const ProductGridView = () => {
  const [data, setData] = useState({ products: [], total: 0 });
  const pageNumber = useRef(0);

  const fetchProductDetails = async () => {
    try {
      pageNumber.current = pageNumber.current + 1;
      const payload = {
        page: pageNumber.current,
        limit: 10,
        // query: "",
        filterType: "antd",
        // sortBy: undefined,
        // sortOrder: undefined,
      };
      const response = await Product.getProductData(payload);
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
    <>
      <span>
        <Typography.Title>Products List</Typography.Title>
      </span>
      <div id="scrollableDiv" className="scrollableDivStyle">
        <InfiniteScroll
          height={500}
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
          className="infiniteScrollStyle"
          // style={{ height: 730 }}
        >
          <List
            grid={{ gutter: 8, column: 4 }}
            dataSource={data.products}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card>
                  <List.Item.Meta
                    title={
                      <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                        {item.name}
                      </span>
                    }
                  />
                  <p>Qty: {item.quantity}</p>
                  <p>Price: {item.price}</p>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default ProductGridView;
