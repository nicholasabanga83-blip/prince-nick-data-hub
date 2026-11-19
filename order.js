const catalog = {
  MTN: [{size:"1 GB",price:4.50},{size:"2 GB",price:9.00},{size:"5 GB",price:20.00}],
  Telecel: [{size:"1 GB",price:5.00},{size:"3 GB",price:15.00},{size:"5 GB",price:25.00}],
  AT: [{size:"1 GB",price:6.00},{size:"2 GB",price:12.00},{size:"5 GB",price:30.00}]
};
let network = "MTN";
let selected = null;
const bundlesEl = document.getElementById("bundles");
const money = n => "GH₵ " + n.toFixed(2);

function renderBundles(){
  bundlesEl.innerHTML = "";
  catalog[network].forEach((item,index)=>{
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bundle" + (selected===index ? " selected" : "");
    button.innerHTML = `<strong>${item.size}</strong><span>${money(item.price)} · demo price</span>`;
    button.addEventListener("click",()=>{selected=index;renderBundles();updateSummary();});
    bundlesEl.appendChild(button);
  });
  updateSummary();
}
function updateSummary(){
  document.getElementById("summary-network").textContent=network;
  const item=selected===null?null:catalog[network][selected];
  document.getElementById("summary-bundle").textContent=item?item.size:"Choose a bundle";
  document.getElementById("summary-price").textContent=item?money(item.price):"GH₵ —";
}
document.querySelectorAll(".network").forEach(button=>{
  button.addEventListener("click",()=>{
    network=button.dataset.network;selected=null;
    document.querySelectorAll(".network").forEach(b=>b.classList.toggle("active",b===button));
    renderBundles();
  });
});
document.getElementById("review").addEventListener("click",()=>{
  const phone=document.getElementById("phone").value.replace(/[\s-]/g,"");
  const normalized=phone.startsWith("+233")?"0"+phone.slice(4):phone;
  if(selected===null){alert("Please select a data bundle.");return;}
  if(!/^0\d{9}$/.test(normalized)){alert("Please enter a valid 10-digit Ghanaian phone number, for example 0241234567.");return;}
  const item=catalog[network][selected];
  document.getElementById("preview-details").innerHTML =
    `<div><span>Network</span><strong>${network}</strong></div>`+
    `<div><span>Bundle</span><strong>${item.size}</strong></div>`+
    `<div><span>Recipient</span><strong>${normalized}</strong></div>`+
    `<div><span>Demo price</span><strong>${money(item.price)}</strong></div>`;
  document.getElementById("confirmation").hidden=false;
  document.getElementById("confirmation").scrollIntoView({behavior:"smooth",block:"start"});
});
document.getElementById("edit").addEventListener("click",()=>{
  document.getElementById("confirmation").hidden=true;
  document.getElementById("phone").focus();
});
document.getElementById("year").textContent=new Date().getFullYear();
renderBundles();
