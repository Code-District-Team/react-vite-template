import { Layout } from "antd";
import moment from "moment";

export default function Footer() {
  const { Footer } = Layout;

  return (
    <Footer style={{ textAlign: "center" }}>
      React Template &copy;{moment().year()} Created by{" "}
      <a href="https://www.codedistrict.com/" target="_blank" rel="noreferrer">
        Code District
      </a>
    </Footer>
  );
}
