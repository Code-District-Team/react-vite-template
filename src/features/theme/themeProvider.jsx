import { ConfigProvider } from "antd";

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#883DCF",
          fontFamily:"Public Sans, sans-serif"
          // borderRadius: "12px",
        },
        components: {
          Layout: {
            colorBgBody: "#F9F9FC",
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
