import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Spinner from "~/common/spinner/spinner";

const { Content } = Layout;

export default function GuestPageLayout() {
  return (
    <Layout className="guest-layout">
      <Content>
        <Outlet />
        <Spinner></Spinner>
      </Content>
    </Layout>
  );
}
