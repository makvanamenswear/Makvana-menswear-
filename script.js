const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const DAILY_LIMIT = 100;

// Generate a 4-digit unique ID
function generateID() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Get today's date in YYYY-MM-DD format
function getToday() {
  let today = new Date();
  return today.toISOString().split("T")[0];
}

// Update limit info on form
function updateLimitInfo() {
  let today = getToday();
  let dailyData = JSON.parse(localStorage.getItem("dailyData")) || { date: today, count: 0 };

  // Reset if new day
  if (dailyData.date !== today) {
    dailyData = { date: today, count: 0 };
    localStorage.setItem("dailyData", JSON.stringify(dailyData));
  }

  document.getElementById("limitInfo").innerText =
    `Today's entries: ${dailyData.count} / ${DAILY_LIMIT}`;
}

function saveData() {
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();

  if (name.length < 2 || phone.length < 7) {
    alert("Enter valid name and phone number!");
    return;
  }

  let today = getToday();
  let dailyData = JSON.parse(localStorage.getItem("dailyData")) || { date: today, count: 0 };

  // Reset if new day
  if (dailyData.date !== today) {
    dailyData = { date: today, count: 0 };
  }

  if (dailyData.count >= DAILY_LIMIT) {
    document.getElementById("message").innerText =
      "❌ Daily limit of 100 entries reached. Please try again tomorrow.";
    return;
  }

  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  let newID = generateID();
  let newCustomer = {
    id: newID,
    name,
    phone,
    date: today
  };

  customers.push(newCustomer);
  localStorage.setItem("customers", JSON.stringify(customers));

  // Update daily counter
  dailyData.count++;
  localStorage.setItem("dailyData", JSON.stringify(dailyData));

  document.getElementById("message").innerText =
    `✅ Data saved successfully! Your unique ID is: ${newID}`;

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";

  updateLimitInfo();
}

// Show login page
function showLogin() {
  document.getElementById("formSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
}

// Admin login
function adminLogin() {
  let user = document.getElementById("adminUser").value;
  let pass = document.getElementById("adminPass").value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminSection").classList.remove("hidden");
    loadData();
  } else {
    document.getElementById("loginMsg").innerText = "Invalid login!";
  }
}

// Load customer data
function loadData() {
  let customers = JSON.parse(localStorage.getItem("customers")) || [];
  let recycleBin = JSON.parse(localStorage.getItem("recycleBin")) || [];

  let table = document.getElementById("dataTable");
  table.innerHTML = "";
  customers.forEach((c) => {
    table.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.phone}</td>
        <td>${c.date}</td>
        <td><button onclick="removeCustomer(${c.id})">Remove</button></td>
      </tr>`;
  });

  let recycleTable = document.getElementById("recycleTable");
  recycleTable.innerHTML = "";
  recycleBin.forEach((c) => {
    recycleTable.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.phone}</td>
        <td>${c.date}</td>
      </tr>`;
  });
}

// Remove customer → move to recycle bin
function removeCustomer(id) {
  let customers = JSON.parse(localStorage.getItem("customers")) || [];
  let recycleBin = JSON.parse(localStorage.getItem("recycleBin")) || [];

  let index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    recycleBin.push(customers[index]); // move to recycle bin
    customers.splice(index, 1); // remove from main list
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("recycleBin", JSON.stringify(recycleBin));
    loadData();
  }
}

// Search functionality
function searchData() {
  let query = document.getElementById("searchBox").value.toLowerCase();
  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  let table = document.getElementById("dataTable");
  table.innerHTML = "";
  customers
    .filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      String(c.id).includes(query)
    )
    .forEach((c) => {
      table.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.phone}</td>
          <td>${c.date}</td>
          <td><button onclick="removeCustomer(${c.id})">Remove</button></td>
        </tr>`;
    });
}

// Logout
function logout() {
  document.getElementById("adminSection").classList.add("hidden");
  document.getElementById("formSection").classList.remove("hidden");
  updateLimitInfo();
}

// Initialize page
window.onload = () => {
  updateLimitInfo();
};
