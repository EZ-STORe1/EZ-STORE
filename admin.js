const STORAGE_KEY = "nova_demo_products";

let products = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

const form = document.getElementById("productForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value;
    const price = Number(document.getElementById("productPrice").value);
    const quantity = Number(document.getElementById("productQuantity").value);
    const description = document.getElementById("productDescription").value.trim();

    if (
        !name ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        alert("تأكد من معلومات المنتج.");
        return;
    }

    const product = {
        id: crypto.randomUUID(),
        name,
        category,
        price,
        quantity,
        description
    };

    products.push(product);

    saveProducts();
    renderProducts();

    form.reset();

    alert("تمت إضافة المنتج بنجاح ✅");
});

function saveProducts() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );
}

function deleteProduct(id) {
    if (!confirm("واش متأكد بغيتي تحذف المنتج؟")) {
        return;
    }

    products = products.filter(product => product.id !== id);

    saveProducts();
    renderProducts();
}

function renderProducts() {
    const table = document.getElementById("productsTable");

    table.replaceChildren();

    let stock = 0;

    products.forEach(product => {
        stock += product.quantity;

        const row = document.createElement("tr");

        const values = [
            product.name,
            product.category,
            "$" + product.price.toFixed(2),
            String(product.quantity)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "حذف";
        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        table.appendChild(row);
    });

    document.getElementById("productCount").textContent =
        products.length;

    document.getElementById("stockCount").textContent =
        stock;
}

renderProducts();
/* BULK IMPORT - DEMO */

const bulkForm = document.getElementById("bulkForm");
const bulkAccounts = document.getElementById("bulkAccounts");
const bulkProduct = document.getElementById("bulkProduct");
const bulkCount = document.getElementById("bulkCount");

function getBulkLines() {
    return bulkAccounts.value
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
}

function refreshBulkProducts() {
    bulkProduct.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "اختر المنتج";
    bulkProduct.appendChild(placeholder);

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        bulkProduct.appendChild(option);
    });
}

bulkAccounts.addEventListener("input", () => {
    bulkCount.textContent = getBulkLines().length;
});

bulkForm.addEventListener("submit", event => {
    event.preventDefault();

    const lines = getBulkLines();

    if (lines.length < 1 || lines.length > 1000) {
        alert("يمكن إضافة من 1 حتى 1000 حساب.");
        return;
    }

    const product = products.find(
        item => item.id === bulkProduct.value
    );

    if (!product) {
        alert("اختر المنتج أولاً.");
        return;
    }

    // نسخة تجريبية: نحفظ العدد فقط وليس بيانات الدخول
    product.quantity += lines.length;

    saveProducts();
    renderProducts();

    bulkAccounts.value = "";
    bulkCount.textContent = "0";

    alert("تمت إضافة " + lines.length + " للمخزون ✅");
});

const originalRenderProducts = renderProducts;

renderProducts = function() {
    originalRenderProducts();
    refreshBulkProducts();
};

refreshBulkProducts();