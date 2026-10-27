const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const courseInput = document.getElementById("course");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const courseError = document.getElementById("courseError");

const tableBody = document.getElementById("tableBody");
const submitBtn = document.getElementById("submitBtn");
const emptyState = document.getElementById("emptyState");
const rosterCount = document.getElementById("rosterCount");

let editRow = null;

function updateRosterState() {
    const rows = tableBody.querySelectorAll("tr").length;

    emptyState.style.display = rows === 0 ? "block" : "none";
    rosterCount.textContent = rows === 1 ? "1 student" : rows + " students";
}

form.addEventListener("submit", function (e) {

    e.preventDefault();

    clearErrors();

    let name = nameInput.value.trim();
    let email = emailInput.value.trim();
    let phone = phoneInput.value.trim();
    let course = courseInput.value.trim();

    let isValid = true;

    if (name === "") {
        nameError.innerText = "Name is required";
        isValid = false;
    } else if (name.length < 3) {
        nameError.innerText = "Name must contain at least 3 characters";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        emailError.innerText = "Email is required";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        emailError.innerText = "Invalid email format";
        isValid = false;
    }

    const phonePattern = /^[0-9]{11}$/;

    if (phone === "") {
        phoneError.innerText = "Phone number is required";
        isValid = false;
    } else if (!phonePattern.test(phone)) {
        phoneError.innerText = "Phone number must be 11 digits";
        isValid = false;
    }

    if (course === "") {
        courseError.innerText = "Course name is required";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    if (editRow === null) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${course}</td>
            <td>
                <div class="row-actions">
                    <button type="button" class="editBtn">Edit</button>
                    <button type="button" class="deleteBtn">Delete</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    } else {

        editRow.cells[0].innerText = name;
        editRow.cells[1].innerText = email;
        editRow.cells[2].innerText = phone;
        editRow.cells[3].innerText = course;

        editRow = null;
        submitBtn.innerText = "Register student";
    }

    form.reset();
    updateRosterState();
});

tableBody.addEventListener("click", function (e) {

    if (e.target.classList.contains("deleteBtn")) {

        if (confirm("Are you sure you want to delete this record?")) {
            e.target.closest("tr").remove();
            updateRosterState();
        }
    }

    if (e.target.classList.contains("editBtn")) {

        editRow = e.target.closest("tr");

        nameInput.value = editRow.cells[0].innerText;
        emailInput.value = editRow.cells[1].innerText;
        phoneInput.value = editRow.cells[2].innerText;
        courseInput.value = editRow.cells[3].innerText;

        submitBtn.innerText = "Update student";
        nameInput.focus();
    }
});

function clearErrors() {

    nameError.innerText = "";
    emailError.innerText = "";
    phoneError.innerText = "";
    courseError.innerText = "";
}

updateRosterState();