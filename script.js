const invoiceForm = document.getElementById("invoiceForm");
const invoiceTableBody = document.querySelector("#invoiceTable tbody");
const downloadPDF = document.getElementById("downloadPDF");
const statusChartCanvas = document.getElementById("statusChart");

let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

// Render invoices in table
function renderInvoices() {
  invoiceTableBody.innerHTML = "";
  invoices.forEach((inv, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${inv.client}</td>
      <td>$${inv.amount}</td>
      <td>${inv.dueDate}</td>
      <td>${inv.status}</td>
      <td>
        <button class="action edit" onclick="editInvoice(${index})">Edit</button>
        <button class="action delete" onclick="deleteInvoice(${index})">Delete</button>
      </td>
    `;
    invoiceTableBody.appendChild(row);
  });
  updateChart();
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

// Add invoice
invoiceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const client = document.getElementById("client").value;
  const amount = document.getElementById("amount").value;
  const dueDate = document.getElementById("dueDate").value;
  const status = document.getElementById("status").value;

  invoices.push({ client, amount, dueDate, status });
  invoiceForm.reset();
  renderInvoices();
});

// Edit invoice
function editInvoice(index) {
  const inv = invoices[index];
  document.getElementById("client").value = inv.client;
  document.getElementById("amount").value = inv.amount;
  document.getElementById("dueDate").value = inv.dueDate;
  document.getElementById("status").value = inv.status;
  invoices.splice(index, 1); // remove old one
  renderInvoices();
}

// Delete invoice
function deleteInvoice(index) {
  invoices.splice(index, 1);
  renderInvoices();
}

// Download PDF
downloadPDF.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Invoice Report", 20, 20);
  let y = 40;
  invoices.forEach((inv, i) => {
    doc.text(`${i + 1}. ${inv.client} - $${inv.amount} - ${inv.dueDate} - ${inv.status}`, 20, y);
    y += 10;
  });
  doc.save("invoices.pdf");
});

// Chart.js for status breakdown
let statusChart = new Chart(statusChartCanvas, {
  type: "doughnut",
  data: {
    labels: ["Paid", "Unpaid", "Overdue"],
    datasets: [{
      label: "Invoices",
      data: [0, 0, 0],
      backgroundColor: ["#4CAF50", "#FFC107", "#F44336"]
    }]
  }
});

function updateChart() {
  const counts = { Paid: 0, Unpaid: 0, Overdue: 0 };
  invoices.forEach(inv => counts[inv.status]++);
  statusChart.data.datasets[0].data = [
    counts.Paid,
    counts.Unpaid,
    counts.Overdue
  ];
  statusChart.update();
}
// Dark mode toggle functionality
const toggleBtn = document.getElementById("toggleDark");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});


// Initial render
renderInvoices();
