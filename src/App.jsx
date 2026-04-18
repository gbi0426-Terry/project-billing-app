import { useState } from "react";

const initProjects = [
  { id: 1, name: "行曜AI POS系統", client: "行曜科技", progress: 65, status: "進行中", due: "2026-06-30" },
  { id: 2, name: "官網重設計", client: "星晴數位", progress: 100, status: "已完成", due: "2026-03-15" },
  { id: 3, name: "BI報表整合", client: "永豐製造", progress: 18, status: "進行中", due: "2026-08-01" },
  { id: 4, name: "行動APP開發", client: "快遞幫", progress: 0, status: "待啟動", due: "2026-12-31" },
];
export default function App() {
  return <div style={{padding:20,fontFamily:"sans-serif"}}><h2>行曜科技 專案帳務管理</h2><p>Loading full app...</p></div>;
}