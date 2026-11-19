const defaultOrders = [
 {id:"PN-demo-1001",phone:"0241234567",network:"MTN",bundle:"1 GB",amount:4.50,status:"Pending"},
 {id:"PN-demo-1002",phone:"0551234567",network:"Telecel",bundle:"3 GB",amount:15.00,status:"Successful"},
 {id:"PN-demo-1003",phone:"0201234567",network:"AT",bundle:"2 GB",amount:12.00,status:"Failed"},
 {id:"PN-demo-1004",phone:"0531234567",network:"MTN",bundle:"2 GB",amount:9.00,status:"Successful"},
 {id:"PN-demo-1005",phone:"0591234567",network:"AT",bundle:"1 GB",amount:6.00,status:"Pending"}
];
const defaultPrices = [
 ["MTN","1 GB",4.50],["MTN","2 GB",9.00],["MTN","5 GB",20.00],
 ["Telecel","1 GB",5.00],["Telecel","3 GB",15.00],["Telecel","5 GB",25.00],
 ["AT","1 GB",6.00],["AT","2 GB",12.00],["AT","5 GB",30.00]
];
const read = (key,fallback) => { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch { return fallback; } };
let orders = read("pndh_demo_orders_v2",defaultOrders);
let prices = read("pndh_demo_prices_v2",defaultPrices);
const money = n => "GH₵"+Number(n).toFixed(2);
function saveOrders(){localStorage.setItem("pndh_demo_orders_v2",JSON.stringify(orders));}
function renderStats(){
 document.getElementById("totalOrders").textContent=orders.length;
 document.getElementById("successfulOrders").textContent=orders.filter(o=>o.status==="Successful").length;
 document.getElementById("pendingOrders").textContent=orders.filter(o=>o.status==="Pending").length;
 document.getElementById("salesValue").textContent=money(orders.filter(o=>o.status==="Successful").reduce((s,o)=>s+Number(o.amount),0));
}
function renderOrders(){
 const q=document.getElementById("searchInput").value.trim().toLowerCase();
 const f=document.getElementById("statusFilter").value;
 const filtered=orders.filter(o=>(f==="all"||o.status===f)&&(`${o.id} ${o.phone}`.toLowerCase().includes(q)));
 const body=document.getElementById("ordersBody");body.innerHTML="";
 filtered.forEach(o=>{
  const tr=document.createElement("tr");
  const values=[o.id,o.phone,o.network,o.bundle,money(o.amount)];
  values.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);});
  const statusTd=document.createElement("td");const badge=document.createElement("span");badge.className="status "+o.status;badge.textContent=o.status;statusTd.appendChild(badge);tr.appendChild(statusTd);
  const actionTd=document.createElement("td");const select=document.createElement("select");select.setAttribute("aria-label","Update status for "+o.id);
  ["Pending","Successful","Failed"].forEach(s=>{const op=document.createElement("option");op.value=s;op.textContent=s;if(s===o.status)op.selected=true;select.appendChild(op);});
  select.addEventListener("change",()=>{o.status=select.value;saveOrders();renderAll();});actionTd.appendChild(select);tr.appendChild(actionTd);body.appendChild(tr);
 });
 document.getElementById("emptyState").hidden=filtered.length!==0;renderStats();
}
function renderPrices(){
 const list=document.getElementById("priceList");list.innerHTML="";
 prices.forEach((p,i)=>{const box=document.createElement("div");box.className="price-item";const label=document.createElement("label");label.textContent=p[0]+" · "+p[1];const input=document.createElement("input");input.type="number";input.min="0";input.step="0.01";input.value=Number(p[2]).toFixed(2);input.dataset.index=i;input.setAttribute("aria-label",p[0]+" "+p[1]+" demo price in Ghana cedis");box.append(label,input);list.appendChild(box);});
}
function renderAll(){renderOrders();renderPrices();}
document.getElementById("searchInput").addEventListener("input",renderOrders);
document.getElementById("statusFilter").addEventListener("change",renderOrders);
document.getElementById("savePrices").addEventListener("click",()=>{
 const inputs=[...document.querySelectorAll("#priceList input")];
 if(inputs.some(i=>i.value===""||!Number.isFinite(Number(i.value))||Number(i.value)<0)){document.getElementById("priceMessage").textContent="Enter valid non-negative sample prices.";return;}
 inputs.forEach(i=>prices[Number(i.dataset.index)][2]=Number(i.value));
 localStorage.setItem("pndh_demo_prices_v2",JSON.stringify(prices));
 document.getElementById("priceMessage").textContent="Sample prices saved in this browser only.";
});
document.getElementById("resetPrices").addEventListener("click",()=>{prices=defaultPrices.map(p=>[...p]);localStorage.removeItem("pndh_demo_prices_v2");renderPrices();document.getElementById("priceMessage").textContent="Sample prices restored.";});
document.getElementById("resetOrders").addEventListener("click",()=>{orders=defaultOrders.map(o=>({...o}));saveOrders();renderOrders();});
renderAll();
