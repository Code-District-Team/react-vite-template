import { Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "~/common/spinner/spinner";
import Footer from "./footer";
import Header from "./header";
import styles from "./layout.module.scss";
import Sider from "./sider";

const { Content } = Layout;

export default function LoggedInPageLayout() {
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
          <Outlet />
          <Spinner></Spinner>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
