import React, { useState } from "react";
import {
  MailOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Button } from "antd";
import type { MenuProps } from "antd";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <MailOutlined />,
    label: "Home",
  },
  {
    key: "2",
    icon: <StarOutlined />,
    label: "Favourites",
  },
  {
    key: "3",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for collapsing sidebar
  const auth = useRecoilValue(authState);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={`h-full flex flex-col bg-white border-r shadow-sm ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-center p-4 border-b">
        <Button
          type="text"
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
        />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="flex-1"
        inlineCollapsed={isCollapsed}
        items={items}
      />

      {/* User Profile */}
      <div
        className={`flex items-center p-4 border-t ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <Avatar size="large" icon={<UserOutlined />} />
        {!isCollapsed && (
          <div className="ml-3">
            <p className="font-semibold text-gray-700">
              {auth.user?.name || "Guest"}
            </p>
            <p className="text-sm text-gray-500">
              {auth.user?.email || "No email"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
