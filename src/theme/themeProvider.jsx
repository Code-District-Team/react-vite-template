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
            bodyBg: "#E5E5E5",
            // colorBgHeader: "#7dbcea"
          },
        },
      }}
      getPopupContainer={(node) => {
        if (node) {
          return node.parentNode;
        }
        return document.body;
      }}
    >
      {children}
    </ConfigProvider>
  );
}

/**
 * Customize theme available tokens
 * https://ant.design/docs/react/customize-theme#api
 */
