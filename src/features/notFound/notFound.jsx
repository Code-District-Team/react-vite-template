import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";

export default function NotFound() {
  return (
    <div className="w-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button icon={<HomeOutlined />} type="primary" href="/">
            Back Home
          </Button>
        }
      />
    </div>
  );
}
