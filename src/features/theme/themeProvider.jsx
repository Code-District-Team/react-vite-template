import { ConfigProvider } from "antd";

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00b96b",
          // borderRadius: "12px",
        },
        components: {
          Layout: {
            colorBgBody: "#E5E5E5",
            // colorBgHeader: "#7dbcea"
          },
          // Button: { borderRadius: "12px !important" },
        },
      }}
      getPopupContainer={(node) => {
        if (node) {
          return node.parentNode;
        }
        return document.body;
      }}
      // renderEmpty={() => <Empty />}
    >
      {children}
    </ConfigProvider>
  );
}
