import { Card, Divider, List, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
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
      >
        <List
          grid={{ gutter: 8, column: 4 }}
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

export default ProductGridView;
