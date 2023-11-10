import { Card, Tabs } from "antd";
import Billing from "./billing";
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Billing",
    children: <Billing />,
  },
  {
    key: "2",
    label: "Company",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Personal Information",
    children: "Content of Tab Pane 3",
  },
];
const Settings = () => {
  return (
    <Card className="card-wrapper">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
  );
};

export default Settings;
