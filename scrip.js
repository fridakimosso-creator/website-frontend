let currentUserId = null;
const token = localStorage.getItem("adminToken");

if (!token) {
    window.location.href = "admin-login.html";
}

// =======================
// FETCH USERS (FIXED)
// =======================
async function fetchUsers() {
    try {
        const res = await fetch("https://registration-backend-lpkd.onrender.com/api/admin/users", {
            headers: { "Authorization": "Bearer " + token }
        });

        // ❌ HANDLE ERRORS PROPERLY
        if (!res.ok) {
            const errorText = await res.text();
            console.log("SERVER ERROR:", errorText);

            alert("Session expired or unauthorized");

            localStorage.removeItem("adminToken");
            window.location.href = "admin-login.html";
            return;
        }

        const users = await res.json();

        const tbody = document.querySelector("#userTable tbody");
        tbody.innerHTML = "";

        let repliesCount = 0;

        users.forEach(user => {
            if (user.reply) repliesCount++;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>${user.phone || ""}</td>
                <td>${user.message || ""}</td>
                <td>${user.reply || ""}</td>
                <td>
                    <button class="reply-btn" data-id="${user.id}">Reply</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById("totalUsers").textContent = users.length;
        document.getElementById("totalReplies").textContent = repliesCount;

        attachEvents();

    } catch (err) {
        console.log("NETWORK ERROR:", err);
        alert("Server not responding");
    }
}

// =======================
// EVENTS
// =======================
function attachEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (confirm("Are you sure?")) {
                const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + token }
                });

                const data = await res.json();
                alert(data.message);
                fetchUsers();
            }
        };
    });

    document.querySelectorAll(".reply-btn").forEach(btn => {
        btn.onclick = () => {
            currentUserId = btn.dataset.id;
            document.getElementById("replyModal").style.display = "flex";
        };
    });
}

// =======================
// REPLY
// =======================
const modal = document.getElementById("replyModal");

document.querySelector(".close").onclick = () => {
    modal.style.display = "none";
};

document.getElementById("sendReply").onclick = async () => {
    const reply = document.getElementById("replyText").value;

    const res = await fetch(`https://registration-backend-lpkd.onrender.com/api/admin/users/${currentUserId}/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ reply })
    });

    const data = await res.json();
    alert(data.message);

    document.getElementById("replyText").value = "";
    modal.style.display = "none";

    fetchUsers();
};

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
}

// =======================
// SEARCH
// =======================
document.getElementById("search").addEventListener("input", function () {
    const query = this.value.toLowerCase();

    document.querySelectorAll("#userTable tbody tr").forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(query)
            ? ""
            : "none";
    });
});

// INIT
fetchUsers();