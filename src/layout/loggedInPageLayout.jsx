import { Layout } from "antd";
import { useState } from "react";
import Spinner from "~/common/spinner/spinner";
import Footer from "./footer";
import Header from "./header";
import styles from "./layout.module.scss";
import Sider from "./sider";

const { Content } = Layout;

export default function LoggedInPageLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className={styles["site-layout"]}>
        <Header collapsed={collapsed} toggle={toggle} />
        <Content>
          {children}
          <Spinner></Spinner>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
