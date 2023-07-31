import { Layout } from "antd";
import Spinner from "~/common/spinner/spinner";
import "../assets/scss/_guestPageLayout.scss";
const { Content } = Layout;

export default function GuestPageLayout({ children }) {
  return (
    <Layout className="guest-layout">
      <Content>
        {children}
        <Spinner></Spinner>
      </Content>
    </Layout>
  );
}
