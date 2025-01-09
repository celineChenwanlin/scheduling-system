import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import Router from "./router/router.ts";
import "./App.css";
import { routerMap } from "./router/routerMap.tsx";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

const layoutStyle = {
  borderRadius: 8,
  height: "100vh",
  overflow: "hidden",
  // width: "calc(50% - 8px)",
  // maxWidth: "calc(50% - 8px)",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  // backgroundColor: "#1677ff",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#002D55",
};

const contentStyle: React.CSSProperties = {
  margin: "20px 0 0 20px",
};

function App() {
  const navigate = useNavigate();
  const MenuItem = routerMap.map((item) => {
    return {
      key: item.path,
      label: item.label,
    };
  });
  const [pageTitle, setPageTitle] = useState("Home");

  // useEffect(() => {
  //   const persistedTodosString = localStorage.getItem("persist:storageType");
  //   console.log("persistedTodosString", persistedTodosString);
  // }, []);

  return (
    <Layout style={layoutStyle}>
      <Sider width="25%" style={siderStyle}>
        <div className="demo-logo-vertical">Scheduling System</div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/"]}
          items={MenuItem}
          onClick={(e) => {
            setPageTitle(
              MenuItem.find((item) => item.key === e.key)?.label || "Home"
            );
            navigate(e.key);
          }}
        />
      </Sider>
      <Layout style={{ overflow: "auto" }}>
        <Header style={headerStyle}>{pageTitle}</Header>
        <div style={contentStyle}>
          <Router />
        </div>
      </Layout>
    </Layout>
  );
}

export default App;
