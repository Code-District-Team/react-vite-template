import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import User from "~/models/user";

export default function Header({ collapsed, toggle }) {
  const { Header } = Layout;
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    const actions = {
      1: () => navigate("/profile", { replace: true }),
      3: () => User.logoutCall(),
      2: () => navigate("/change-password", { replace: true }),
    };
    actions[key]();
  };
  const items = [
    {
      key: 1,
      label: "Profile",
    },
    {
      key: 2,
      label: "Change Password",
    },
    {
      type: "divider",
    },
    {
      key: 3,
      label: "Log Out",
    },
  ];

  return (
    <Header>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: toggle,
      })}
      <div className="app-header-right">
        <div className="loggedin-user-dd">
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar icon={<UserOutlined />} /> {User.getFullName()}
              <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
