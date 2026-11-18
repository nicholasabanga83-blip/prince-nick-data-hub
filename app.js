const catalog = {
  MTN: [{volume:"1 GB",price:"GH₵ —",duration:"Sample package"},{volume:"2 GB",price:"GH₵ —",duration:"Sample package"},{volume:"5 GB",price:"GH₵ —",duration:"Sample package"}],
  Telecel: [{volume:"1 GB",price:"GH₵ —",duration:"Sample package"},{volume:"3 GB",price:"GH₵ —",duration:"Sample package"},{volume:"5 GB",price:"GH₵ —",duration:"Sample package"}],
  AT: [{volume:"1 GB",price:"GH₵ —",duration:"Sample package"},{volume:"2 GB",price:"GH₵ —",duration:"Sample package"},{volume:"5 GB",price:"GH₵ —",duration:"Sample package"}]
};
let selectedNetwork = "MTN";
let selectedBundle = null;
const grid = document.querySelector("#bundleGrid");
const dialog = document.querySelector("#orderDialog");
function renderBundles(){
  grid.innerHTML = "";
  catalog[selectedNetwork].forEach(bundle => {
    const card = document.createElement("article");
    card.className = "bundle-card";
    card.innerHTML = `<div class="eyebrow">${selectedNetwork}</div><div class="volume">${bundle.volume}</div><div class="duration">${bundle.duration}</div><div class="price">${bundle.price}</div><button type="button">Select bundle →</button>`;
    card.querySelector("button").addEventListener("click", () => openOrder(bundle));
    grid.appendChild(card);
  });
}
function openOrder(bundle){
  selectedBundle = bundle;
  document.querySelector("#dialogTitle").textContent = `${selectedNetwork} ${bundle.volume}`;
  document.querySelector("#dialogDetail").textContent = `Displayed price: ${bundle.price} (placeholder)`;
  document.querySelector("#phone").value = "";
  document.querySelector("#formMessage").textContent = "";
  document.querySelector("#formMessage").className = "form-message";
  dialog.showModal();
}
document.querySelectorAll(".network").forEach(button => button.addEventListener("click", () => {
  selectedNetwork = button.dataset.network;
  document.querySelectorAll(".network").forEach(item => item.classList.toggle("active", item === button));
  renderBundles();
}));
document.querySelector("#previewOrder").addEventListener("click", () => {
  const phone = document.querySelector("#phone").value.replace(/\s+/g,"");
  const message = document.querySelector("#formMessage");
  if(!/^0\d{9}$/.test(phone)){
    message.textContent = "Please enter a valid 10-digit Ghanaian mobile number.";
    message.className = "form-message error";
    return;
  }
  message.textContent = `Number format looks valid. This is only a preview; no order or payment has been placed.`;
  message.className = "form-message success";
});
document.querySelector("#year").textContent = new Date().getFullYear();
renderBundles();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}