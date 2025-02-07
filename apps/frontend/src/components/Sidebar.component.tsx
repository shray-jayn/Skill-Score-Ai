import React, { useState } from "react";
import {
  MailOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Menu, Avatar} from "antd";
import type { MenuProps } from "antd";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/",
    icon: <UploadOutlined/>,
    label: "Upload",
  },
  {
    key: "/feedback",
    icon: <MailOutlined />,
    label: "Feedback & Reports",
  },
];

const Sidebar: React.FC = () => {

  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [stateOpenKeys, setStateOpenKeys] = useState([location.pathname]); 
  const auth = useRecoilValue(authState); 
  const [isCollapsed, setIsCollapsed] = useState(false); 


  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    setStateOpenKeys(openKeys);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key); 
  };


  return (
    <div
      className={`h-full flex flex-col bg-white border-r shadow-sm ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >

      <div className="flex items-center justify-center p-5 border-b  text-blue-800 text-xl font-semibold">
        <h2>Skill Score AI</h2>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]} 
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick} 
        style={{ flex: 1 }}
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
