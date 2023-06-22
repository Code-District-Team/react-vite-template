import { HomeOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";

export default function SomethingWentWrong() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button icon={<HomeOutlined />} type="primary" href="/">
          Back Home
        </Button>
      }
    />
  );
}
