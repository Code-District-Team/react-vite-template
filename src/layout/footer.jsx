import { Layout } from "antd";
import dayjs from "dayjs";

export default function Footer() {
  const { Footer } = Layout;

  return (
    <Footer style={{ textAlign: "center" }}>
      React Template &copy;{dayjs().year()} Created by{" "}
      <a href="https://www.codedistrict.com/" target="_blank" rel="noreferrer">
        Code District
      </a>
    </Footer>
  );
}
