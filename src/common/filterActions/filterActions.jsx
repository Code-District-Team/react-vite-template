import { SearchOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

export default function FilterActions({
  confirm,
  close,
  clearFilters,
  handleReset,
}) {
  return (
    <Space>
      <Button
        type="primary"
        onClick={() => {
          confirm();
        }}
        icon={<SearchOutlined />}
        size="small"
        style={{
          width: 90,
        }}
      >
        Search
      </Button>
      <Button
        onClick={() => clearFilters && handleReset(clearFilters)}
        size="small"
        style={{
          width: 90,
        }}
      >
        Reset
      </Button>
      <Button
        type="link"
        size="small"
        onClick={() => {
          close();
        }}
      >
        close
      </Button>
    </Space>
  );
}
