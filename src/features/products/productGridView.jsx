import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, List, Skeleton, Typography } from "antd";
import Card from "antd/es/card/Card";
const ProductGridView = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo",
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
  }, []);
  console.log("our data", data);
  return (
    <>
      <Card>
        <Typography.Title>
          Virtual Products List with Grid View
        </Typography.Title>
        <div
          id="scrollableDiv"
          style={{
            height: 900,
            overflow: "auto",
            padding: "0 16px",
            border: "1px solid rgba(140, 140, 140, 0.35)",
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < 50}
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
              dataSource={data}
              renderItem={(item) => (
                <List.Item key={item.email}>
                  <List.Item.Meta
                    // avatar={<Avatar src={item.picture.large} />}
                    title="Product Name Sample Name"
                    description="Qty:10 "
                  />
                  <div>Price: 1500/-</div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </Card>
    </>
  );
};

export default ProductGridView;
