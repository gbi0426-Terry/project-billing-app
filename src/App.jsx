import { useState } from "react";

const initProjects = [
  { id: 1, name: "行曜AI POS系統", client: "行曜科技", progress: 65, status: "進行中", due: "2026-06-30" },
  { id: 2, name: "官網重設計", client: "星晴數位", progress: 100, status: "已完成", due: "2026-03-15" },
  { id: 3, name: "BI報表整合", client: "永豐製造", progress: 18, status: "進行中", due: "2026-08-01" },
  { id: 4, name: "行動APP開發", client: "快遞幫", progress: 0, status: "待啟動", due: "2026-12-31" },
];

const initInvoices = [
  { id: 1, no: "INV-041", projectId: 1, client: "行曜科技", amount: 160000, due: "2026-04-30", status: "未收款" },
  { id: 2, no: "INV-040", projectId: 2, client: "星晴數位", amount: 60000, due: "2026-04-14", status: "已收款" },
  { id: 3, no: "INV-037", projectId: 5, client: "台揚工業", amount: 95000, due: "2026-03-31", status: "逾期" },
];

const STATUS = {
  "進行中": { color: "#2B82D9", bg: "#E8F4FD" },
  "已完成": { color: "#22A96A", bg: "#E8F8F0" },
  "待啟動": { color: "#F59E0B", bg: "#FDF6E8" },
  "未收款": { color: "#2B82D9", bg: "#E8F4FD" },
  "已收款": { color: "#22A96A", bg: "#E8F8F0" },
  "逾期":   { color: "#E84040", bg: "#FEECEC" },
};

const fmt = (n) => `NT$${Number(n).toLocaleString()}`;

function Chip({ label }) {
  const s = STATUS[label] || { color: "#8FA8C8", bg: "#F0F4FA" };
  return <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>{label}</span>;
}

function Bar({ pct, color }) {
  return <div style={{ background: "#EEF3FA", borderRadius: 99, height: 5 }}><div style={{ width: `${Math.min(pct,100)}%`, background: color, height: "100%", borderRadius: 99, transition: "width .5s" }} /></div>;
}

function Sheet({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,25,45,.4)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 520, padding: "24px 24px 36px", boxShadow: "0 -8px 40px rgba(0,0,0,.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#1A2F4A" }}>{title}</span>
          <button onClick={onClose} style={{ background: "#F0F4FA", border: "none", borderRadius: 99, width: 30, height: 30, fontSize: 16, cursor: "pointer", color: "#6B84A0" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function inp(extra = {}) {
  return { padding: "10px 13px", border: "1.5px solid #E2EAF4", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1A2F4A", outline: "none", width: "100%", boxSizing: "border-box", ...extra };
}

function ProjectInvoicesSheet({ project, invoices, onMarkPaid, onUnmarkPaid, onEdit, onAddInvoice, onClose }) {
  const pInvoices = invoices.filter(i => i.projectId === project.id);
  return (
    <Sheet title={`${project.name} 的發票`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto" }}>
        {pInvoices.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "#C0CEDF", fontSize: 14 }}>尚無發票</div>}
        {pInvoices.map(inv => (
          <div key={inv.id} style={{ background: "#F8FAFD", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: "#8FA8C8" }}>{inv.no} · 到期 {inv.due}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Chip label={inv.status} />
                <button onClick={() => { onEdit(inv); onClose(); }} style={{ fontSize: 11, fontWeight: 700, color: "#6B84A0", background: "#EAEEF4", border: "none", borderRadius: 7, padding: "3px 9px", cursor: "pointer", fontFamily: "inherit" }}>編輯</button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 17, color: "#1A2F4A" }}>{fmt(inv.amount)}</span>
              {inv.status !== "已收款"
                ? <button onClick={() => onMarkPaid(inv.id)} style={{ background: "#22A96A", color: "#fff", border: "none", borderRadius: 9, padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>標記收款</button>
                : <button onClick={() => onUnmarkPaid(inv.id)} style={{ background: "none", border: "1.5px solid #22A96A", borderRadius: 9, padding: "5px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#22A96A" }}>✓ 已完成</button>
              }
            </div>
          </div>
        ))}
        <button onClick={() => { onAddInvoice(project.id); onClose(); }} style={{ background: "#1A5FAB", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>＋ 開立新發票</button>
      </div>
    </Sheet>
  );
}

function ProjectForm({ project, onSave, onClose }) {
  const isEdit = !!project;
  const [name, setName] = useState(project?.name || "");
  const [client, setClient] = useState(project?.client || "");
  const [due, setDue] = useState(project?.due || "");
  return (
    <Sheet title={isEdit ? "編輯專案" : "新增專案"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input style={inp()} placeholder="專案名稱" value={name} onChange={e => setName(e.target.value)} />
        <input style={inp()} placeholder="客戶名稱" value={client} onChange={e => setClient(e.target.value)} />
        <input style={inp()} type="date" value={due} onChange={e => setDue(e.target.value)} />
        <button onClick={() => { if (!name) return; onSave(isEdit ? { ...project, name, client, due } : { name, client, due, progress: 0, status: "待啟動", id: Date.now() }); onClose(); }} style={{ background: "#1A5FAB", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
          {isEdit ? "儲存變更" : "新增專案"}
        </button>
      </div>
    </Sheet>
  );
}

function InvoiceForm({ invoice, projects, onSave, onClose, defaultProjectId }) {
  const isEdit = !!invoice;
  const [projectId, setProjectId] = useState(invoice?.projectId || defaultProjectId || projects[0]?.id || "");
  const [amount, setAmount] = useState(invoice?.amount || "");
  const [due, setDue] = useState(invoice?.due || "");
  const [status, setStatus] = useState(invoice?.status || "未收款");
  const proj = projects.find(p => p.id === Number(projectId));
  const [client, setClient] = useState(invoice?.client || proj?.client || "");
  const handleProjectChange = (id) => { setProjectId(Number(id)); const p = projects.find(pp => pp.id === Number(id)); if (p) setClient(p.client); };
  return (
    <Sheet title={isEdit ? "編輯發票" : "開立發票"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!isEdit && <div><div style={{ fontSize: 12, fontWeight: 700, color: "#6B84A0", marginBottom: 5 }}>綁定專案</div><select value={projectId} onChange={e => handleProjectChange(e.target.value)} style={inp()}>{projects.map(p => <option key={p.id} value={p.id}>{p.name}（{p.client}）</option>)}</select></div>}
        {isEdit && proj && <div style={{ background: "#F0F4FA", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#4A6080" }}>📁 {proj.name}</div>}
        <input style={inp()} placeholder="客戶名稱" value={client} onChange={e => setClient(e.target.value)} />
        <input style={inp()} type="number" placeholder="金額 (NT$)" value={amount} onChange={e => setAmount(e.target.value)} />
        <input style={inp()} type="date" value={due} onChange={e => setDue(e.target.value)} />
        {isEdit && <select value={status} onChange={e => setStatus(e.target.value)} style={inp()}>{["未收款","已收款","逾期"].map(s => <option key={s} value={s}>{s}</option>)}</select>}
        <button onClick={() => { if (!amount) return; onSave(isEdit ? { ...invoice, client, amount: Number(amount), due, status } : { projectId: Number(projectId), client, amount: Number(amount), due, status: "未收款", no: `INV-${Date.now().toString().slice(-3)}`, id: Date.now() }); onClose(); }} style={{ background: "#1A5FAB", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
          {isEdit ? "儲存變更" : "開立發票"}
        </button>
      </div>
    </Sheet>
  );
}

export default function App() {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState(initProjects);
  const [invoices, setInvoices] = useState(initInvoices);
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };
  const markPaid = (id) => { setInvoices(is => is.map(i => i.id === id ? { ...i, status: "已收款" } : i)); showToast("已標記為收款 ✓"); };
  const saveProject = (p) => { if (p.id && projects.find(pp => pp.id === p.id)) { setProjects(ps => ps.map(pp => pp.id === p.id ? p : pp)); showToast("專案已更新 ✓"); } else { setProjects(ps => [p, ...ps]); showToast("專案已新增 ✓"); } };
  const saveInvoice = (inv) => { if (inv.id && invoices.find(i => i.id === inv.id)) { setInvoices(is => is.map(i => i.id === inv.id ? inv : i)); showToast("發票已更新 ✓"); } else { setInvoices(is => [inv, ...is]); showToast("發票已開立 ✓"); } };
  const totalReceivable = invoices.filter(i => i.status !== "已收款").reduce((a, i) => a + i.amount, 0);
  const editBtn = { fontSize: 11, fontWeight: 700, color: "#6B84A0", background: "#F0F4FA", border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" };
  return (
    <div style={{ minHeight: "100vh", background: "#F2F5FA", fontFamily: "'Noto Sans TC','Microsoft JhengHei',sans-serif", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "#1A2F4A", padding: "20px 20px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div><div style={{ fontWeight: 900, fontSize: 17, color: "#fff" }}>行曜科技</div><div style={{ fontSize: 11, color: "#5B85B0" }}>專案 · 帳務管理</div></div>
          <button onClick={() => setSheet(tab === "projects" ? "addProject" : { type: "addInvoice" })} style={{ width: 40, height: 40, borderRadius: "50%", background: "#2B82D9", color: "#fff", border: "none", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(43,130,217,.4)" }}>＋</button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["projects","專案"],["invoices","發票"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: tab===id ? "#fff" : "#5B85B0", borderBottom: tab===id ? "2.5px solid #2B82D9" : "2.5px solid transparent", transition: "all .15s" }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px 16px 100px" }}>
        {tab === "projects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#8FA8C8", fontWeight: 600, margin: "4px 0 6px" }}>共 {projects.length} 個專案 · 進行中 {projects.filter(p => p.status==="進行中").length} 個</div>
            {projects.map(p => {
              const s = STATUS[p.status] || {};
              const pInvoices = invoices.filter(i => i.projectId === p.id);
              const pReceivable = pInvoices.filter(i => i.status !== "已收款").reduce((a,i) => a+i.amount, 0);
              return (
                <div key={p.id} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 1px 8px rgba(26,95,171,.06)", borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div><div style={{ fontWeight: 700, color: "#1A2F4A", fontSize: 15 }}>{p.name}</div><div style={{ fontSize: 12, color: "#8FA8C8", marginTop: 2 }}>{p.client} · 到期 {p.due}</div></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Chip label={p.status} /><button style={editBtn} onClick={() => setSheet({ type: "editProject", data: p })}>編輯</button></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}><Bar pct={p.progress} color={s.color} /></div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: s.color, minWidth: 34 }}>{p.progress}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFD", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
                    <div onClick={() => pInvoices.length > 0 && setSheet({ type: "projectInvoices", data: p })} style={{ fontSize: 12, color: "#6B84A0", cursor: pInvoices.length > 0 ? "pointer" : "default", flex: 1 }}>
                      {pInvoices.length > 0 ? <span>發票 <strong style={{ color: "#1A5FAB", textDecoration: "underline" }}>{pInvoices.length} 張</strong> · 應收 <strong style={{ color: pReceivable > 0 ? "#E84040" : "#22A96A" }}>{fmt(pReceivable)}</strong></span> : <span style={{ color: "#C0CEDF" }}>尚無發票</span>}
                    </div>
                    <button onClick={() => setSheet({ type: "addInvoice", projectId: p.id })} style={{ fontSize: 11, fontWeight: 700, color: "#2B82D9", background: "#E8F4FD", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>＋ 開立發票</button>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0,25,50,75,100].map(v => (
                      <button key={v} onClick={() => { setProjects(ps => ps.map(pp => pp.id===p.id ? { ...pp, progress: v, status: v===100?"已完成":v===0?"待啟動":"進行中" } : pp)); showToast(`進度更新為 ${v}% ✓`); }} style={{ flex: 1, padding: "5px 0", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, background: p.progress===v ? s.color : "#F0F4FA", color: p.progress===v ? "#fff" : "#8FA8C8", transition: "all .15s" }}>{v}%</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab === "invoices" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#1A5FAB", borderRadius: 14, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>應收帳款合計</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{fmt(totalReceivable)}</div>
            </div>
            {invoices.map(inv => {
              const proj = projects.find(p => p.id === inv.projectId);
              return (
                <div key={inv.id} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 1px 8px rgba(26,95,171,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div><div style={{ fontWeight: 700, color: "#1A2F4A", fontSize: 15 }}>{inv.client}</div><div style={{ fontSize: 12, color: "#8FA8C8", marginTop: 2 }}>{inv.no} · 到期 {inv.due}</div></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Chip label={inv.status} /><button style={editBtn} onClick={() => setSheet({ type: "editInvoice", data: inv })}>編輯</button></div>
                  </div>
                  {proj && <div style={{ fontSize: 11, color: "#2B82D9", fontWeight: 600, background: "#E8F4FD", display: "inline-block", padding: "2px 8px", borderRadius: 6, marginBottom: 10 }}>📁 {proj.name}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 900, fontSize: 18, color: "#1A2F4A" }}>{fmt(inv.amount)}</span>
                    {inv.status !== "已收款"
                      ? <button onClick={() => markPaid(inv.id)} style={{ background: "#22A96A", color: "#fff", border: "none", borderRadius: 10, padding: "7px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>標記收款</button>
                      : <button onClick={() => { setInvoices(is => is.map(i => i.id===inv.id ? { ...i, status: "未收款" } : i)); showToast("已還原為未收款"); }} style={{ background: "none", border: "1.5px solid #22A96A", borderRadius: 10, padding: "6px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#22A96A" }}>✓ 已完成</button>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {sheet === "addProject" && <ProjectForm onSave={saveProject} onClose={() => setSheet(null)} />}
      {sheet?.type === "editProject" && <ProjectForm project={sheet.data} onSave={saveProject} onClose={() => setSheet(null)} />}
      {sheet?.type === "projectInvoices" && <ProjectInvoicesSheet project={sheet.data} invoices={invoices} onMarkPaid={(id) => { setInvoices(is => is.map(i => i.id===id ? { ...i, status: "已收款" } : i)); showToast("已標記為收款 ✓"); }} onUnmarkPaid={(id) => { setInvoices(is => is.map(i => i.id===id ? { ...i, status: "未收款" } : i)); showToast("已還原為未收款"); }} onEdit={(inv) => setSheet({ type: "editInvoice", data: inv })} onAddInvoice={(projectId) => setSheet({ type: "addInvoice", projectId })} onClose={() => setSheet(null)} />}
      {sheet?.type === "addInvoice" && <InvoiceForm projects={projects} defaultProjectId={sheet.projectId} onSave={saveInvoice} onClose={() => setSheet(null)} />}
      {sheet?.type === "editInvoice" && <InvoiceForm invoice={sheet.data} projects={projects} onSave={saveInvoice} onClose={() => setSheet(null)} />}
      {toast && <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1A2F4A", color: "#fff", padding: "10px 22px", borderRadius: 99, fontSize: 13, fontWeight: 700, zIndex: 9999, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>{toast}</div>}
    </div>
  );
}