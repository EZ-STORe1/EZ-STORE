/* EZ STORE - FREE DELIVERY DEMO
   تجربة محلية بلا USDT ولا Supabase
   لا تستعمل بيانات حسابات حقيقية هنا
*/

let selectedProduct = "";
let selectedPrice = 0;

const DEMO_STOCK_KEY = "nova_free_demo_stock_v2";

const INITIAL_STOCK = {
  instagram: [
    { username: "demo_ig_001", password: "TEST-IG-001" },
    { username: "demo_ig_002", password: "TEST-IG-002" },
    { username: "demo_ig_003", password: "TEST-IG-003" },
    { username: "demo_ig_004", password: "TEST-IG-004" },
    { username: "demo_ig_005", password: "TEST-IG-005" }
  ],
  tiktok: [
    { username: "demo_tt_001", password: "TEST-TT-001" },
    { username: "demo_tt_002", password: "TEST-TT-002" },
    { username: "demo_tt_003", password: "TEST-TT-003" }
  ],
  x: [
    { username: "demo_x_001", password: "TEST-X-001" },
    { username: "demo_x_002", password: "TEST-X-002" }
  ],
  gaming: [
    { username: "demo_game_001", password: "TEST-GAME-001" },
    { username: "demo_game_002", password: "TEST-GAME-002" }
  ]
};

function loadDemoStock() {
  try {
    const saved = localStorage.getItem(DEMO_STOCK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        Object.keys(INITIAL_STOCK).every(
          key => Array.isArray(parsed[key])
        )
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Stock error:", error);
  }

  return JSON.parse(JSON.stringify(INITIAL_STOCK));
}

let demoStock = loadDemoStock();

function saveDemoStock() {
  localStorage.setItem(
    DEMO_STOCK_KEY,
    JSON.stringify(demoStock)
  );
}

function getProductType(name) {
  const text = String(name).toLowerCase();

  if (text.includes("instagram") || text.includes("انستغرام")) {
    return "instagram";
  }

  if (text.includes("tiktok") || text.includes("tik tok") ||
      text.includes("تيك")) {
    return "tiktok";
  }

  if (text === "x" || text.includes("twitter") ||
      text.includes("تويتر")) {
    return "x";
  }

  return "gaming";
}

/* نافذة الطلب */

function openPurchase(name, price) {
  selectedProduct = name;
  selectedPrice = Number(price) || 0;

  const productInput = document.getElementById("purchaseProduct");
  const qtyInput = document.getElementById("purchaseQty");
  const emailInput = document.getElementById("purchaseEmail");
  const modal = document.getElementById("purchaseModal");

  if (!productInput || !qtyInput || !emailInput || !modal) {
    alert("عناصر نافذة الطلب غير موجودة في index.html");
    return;
  }

  productInput.value = name;
  qtyInput.value = 1;
  qtyInput.max = 5;
  emailInput.value = "";

  updatePurchaseTotal();
  modal.classList.add("active");
}

function closePurchase() {
  document.getElementById("purchaseModal")
    ?.classList.remove("active");
}

function changeQty(amount) {
  const input = document.getElementById("purchaseQty");
  if (!input) return;

  const current = Number(input.value) || 1;
  input.value = Math.max(1, Math.min(5, current + amount));

  updatePurchaseTotal();
}

function updatePurchaseTotal() {
  const total = document.getElementById("purchaseTotal");

  if (total) {
    total.textContent = "مجاني";
  }
}

/* عرض الحسابات المسلمة */

function showDeliveredAccounts(accounts, email) {
  let panel = document.getElementById("novaDeliveryResult");

  if (!panel) {
    panel = document.createElement("section");
    panel.id = "novaDeliveryResult";

    Object.assign(panel.style, {
      background: "#171727",
      border: "2px solid #8b5cf6",
      borderRadius: "16px",
      padding: "22px",
      margin: "25px auto",
      maxWidth: "650px",
      color: "#ffffff",
      direction: "rtl",
      fontFamily: "Tahoma, Arial, sans-serif"
    });

    document.body.appendChild(panel);
  }

  panel.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = "✅ تم التسليم التجريبي";
  heading.style.color = "#86efac";

  const emailInfo = document.createElement("p");
  emailInfo.textContent = "الإيميل: " + email;

  panel.append(heading, emailInfo);

  const deliveryText = accounts.map((account, index) =>
    "Account " + (index + 1) + "\n" +
    "Username: " + account.username + "\n" +
    "Password: " + account.password
  ).join("\n\n");

  accounts.forEach((account, index) => {
    const box = document.createElement("div");

    Object.assign(box.style, {
      background: "#0b0b17",
      borderRadius: "10px",
      padding: "15px",
      margin: "12px 0",
      overflowWrap: "anywhere"
    });

    const title = document.createElement("h3");
    title.textContent = "الحساب رقم " + (index + 1);

    const username = document.createElement("p");
    username.textContent = "Username: " + account.username;

    const password = document.createElement("p");
    password.textContent = "Password: " + account.password;

    box.append(title, username, password);
    panel.appendChild(box);
  });

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "نسخ بيانات الحسابات";

  copyButton.onclick = async () => {
    try {
      await navigator.clipboard.writeText(deliveryText);
      alert("تم نسخ الحسابات");
    } catch {
      alert("النسخ التلقائي غير متاح في هذا المتصفح");
    }
  };

  const mailButton = document.createElement("a");
  mailButton.textContent = "فتح رسالة الإيميل";
  mailButton.href =
    "mailto:" + encodeURIComponent(email) +
    "?subject=" + encodeURIComponent("NOVA MARKET - Demo Delivery") +
    "&body=" + encodeURIComponent(
      "Test accounts only\n\n" + deliveryText
    );

  for (const element of [copyButton, mailButton]) {
    Object.assign(element.style, {
      display: "inline-block",
      background: "#7c3aed",
      color: "#ffffff",
      padding: "12px 16px",
      border: "none",
      borderRadius: "9px",
      margin: "8px",
      textDecoration: "none",
      cursor: "pointer"
    });
    panel.appendChild(element);
  }

  const note = document.createElement("p");
  note.textContent =
    "تنبيه: هادي تجربة محلية. الإيميل ما كيتصيفطش تلقائياً.";
  note.style.color = "#fbbf24";

  panel.appendChild(note);

  panel.scrollIntoView({ behavior: "smooth" });
}

/* الطلب المجاني */

function submitDemoOrder(event) {
  event.preventDefault();

  const qty = Number(
    document.getElementById("purchaseQty")?.value
  );

  const email = document.getElementById("purchaseEmail")
    ?.value.trim();

  if (!Number.isInteger(qty) || qty < 1 || qty > 5) {
    alert("الكمية خاصها تكون بين 1 و5");
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("دخل بريد إلكتروني صحيح");
    return;
  }

  const type = getProductType(selectedProduct);
  const available = demoStock[type];

  if (!available || available.length < qty) {
    alert(
      "المخزون التجريبي غير كافي.\n" +
      "المتوفر: " + (available?.length || 0)
    );
    return;
  }

  const delivered = available.splice(0, qty);
  saveDemoStock();

  closePurchase();
  showDeliveredAccounts(delivered, email);
}

/* تسجيل الدخول - تجريبي */

function openLogin() {
  const modal = document.getElementById("loginModal");

  if (!modal) {
    alert("نافذة تسجيل الدخول غير موجودة");
    return;
  }

  modal.style.display = "flex";
  modal.classList.add("active");
}

function closeLogin() {
  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("active");
  }
}

/* منتجات Admin التجريبية */

function getDemoProducts() {
  try {
    return JSON.parse(
      localStorage.getItem("nova_demo_products") || "[]"
    );
  } catch {
    return [];
  }
}

function showAdminProducts() {
  const products = getDemoProducts();

  const instagramProducts = products.filter(product =>
    String(product.category || "")
      .toLowerCase().includes("instagram")
  );

  const instagramCard =
    document.querySelector(".social-card.instagram");

  if (!instagramCard || !instagramProducts.length) return;

  const product = instagramProducts[0];

  const title = instagramCard.querySelector("h3");
  if (title) title.textContent = product.name;

  const description = instagramCard.querySelector("ul");
  if (description) {
    description.replaceChildren();

    const li = document.createElement("li");
    li.textContent = product.description || "حساب تجريبي";
    description.appendChild(li);
  }

  const price = instagramCard.querySelector(
    ".social-price strong"
  );

  if (price) price.textContent = "مجاني";

  const button = instagramCard.querySelector(
    ".social-price button"
  );

  if (button) {
    button.textContent = "استلام مجاني";
    button.disabled = false;
    button.onclick = () => openPurchase(product.name, 0);
  }
}

function showInstagramAccounts() {
  const container =
    document.getElementById("instagramAddedAccounts");

  if (!container) return;

  const products = getDemoProducts().filter(product =>
    String(product.category || "")
      .toLowerCase().includes("instagram")
  );

  container.replaceChildren();

  products.forEach(product => {
    const item = document.createElement("div");
    item.className = "added-instagram-account";

    const name = document.createElement("h4");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description || "";

    const price = document.createElement("strong");
    price.textContent = "مجاني";

    const button = document.createElement("button");
    button.textContent = "استلام مجاني";
    button.onclick = () => openPurchase(product.name, 0);

    item.append(name, description, price, button);
    container.appendChild(item);
  });
}

/* تشغيل الوظائف */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("purchaseQty")
    ?.addEventListener("input", updatePurchaseTotal);

  document.getElementById("purchaseForm")
    ?.addEventListener("submit", submitDemoOrder);

  document.getElementById("loginForm")
    ?.addEventListener("submit", event => {
      event.preventDefault();
      alert("تسجيل الدخول تجريبي فقط");
    });

  showAdminProducts();
  showInstagramAccounts();
});