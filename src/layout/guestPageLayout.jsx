import React from "react";
import { Layout } from "antd";
import Spinner from "~/common/spinner/spinner";

const { Content } = Layout;

export default function GuestPageLayout({ children }) {
  return (
    <React.Fragment>
      <Layout className="guest-layout">
        <Content>
          {children}
          <Spinner></Spinner>
        </Content>
      </Layout>
    </React.Fragment>
  );
}
