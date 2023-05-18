import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "~/assets/images/logo.png";
import navigations from "./navigations";

export default function Sider({ collapsed, setCollapsed }) {
  const { Sider } = Layout;
  const location = useLocation();

  const [collapsedWidth, setCollapsedWidth] = useState(80);
  const [openKeys, setOpenKeys] = useState([location.pathname.split("/")[1]]);

  const onOpenChange = (keys) => {
    setOpenKeys([...keys]);
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const onBreakpoint = (broken) => {
    if (broken) {
      setCollapsedWidth(0);
    } else {
      setCollapsedWidth(80);
    }
  };

  return (
    <Sider
      breakpoint="md"
      collapsible
      collapsed={collapsed}
      collapsedWidth={collapsedWidth}
      onCollapse={onCollapse}
      onBreakpoint={onBreakpoint}
      trigger={null}
    >
      <div className="ant-layout-sider-logo">
        <img src={Logo} alt="" />
      </div>

      {
        // TODO: Add permission check
      }
      <Menu
        mode="inline"
        className="sider-menu-list"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={[location.pathname]}
        items={navigations.map((navigation) => {
          if ((navigation.children?.length ?? 0) > 0) {
            const subMenuKey = navigation.children[0].path.split("/")[1];
            return {
              key: subMenuKey,
              label: navigation.name,
              children: navigation.children.map((child) => ({
                ...child,
                key: child.path,
                label: <Link to={child.path}>{child.name}</Link>,
              })),
            };
          } else {
            return {
              key: navigation.path,
              icon: navigation.icon,
              label: <Link to={navigation.path}>{navigation.name}</Link>,
            };
          }
        })}
      />
    </Sider>
  );
}
