import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";

export default function Unauthorized() {
  return (
    <div className="w-100">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button icon={<HomeOutlined />} type="primary" href="/">
            Back Home
          </Button>
        }
      />
    </div>
  );
}
