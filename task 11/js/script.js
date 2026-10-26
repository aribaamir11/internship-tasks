"use strict";

const studentForm = document.querySelector("#studentForm");
const studentTableBody = document.querySelector("#studentTableBody");
const emptyState = document.querySelector("#emptyState");
const recordCount = document.querySelector("#recordCount");
const formTitle = document.querySelector("#formTitle");
const formAlert = document.querySelector("#formAlert");
const submitButton = document.querySelector("#submitButton");
const cancelEditButton = document.querySelector("#cancelEditButton");

const fields = {
  fullName: document.querySelector("#fullName"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  course: document.querySelector("#course")
};

const students = [];
let editingIndex = null;

const validators = {
  fullName(value) {
    if (!value) return "Full name is required.";
    if (value.length < 3) return "Full name must be at least 3 characters.";
    if (!/^[a-zA-ZÀ-ÿ' -]+$/.test(value)) {
      return "Full name can only contain letters, spaces, apostrophes, and hyphens.";
    }
    return "";
  },
  email(value) {
    if (!value) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return "Enter a valid email address.";
    }
    return "";
  },
  phone(value) {
    if (!value) return "Phone number is required.";
    if (!/^\+?[\d\s()-]+$/.test(value)) {
      return "Phone number contains invalid characters.";
    }

    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      return "Phone number must contain 10 to 15 digits.";
    }
    return "";
  },
  course(value) {
    if (!value) return "Course name is required.";
    if (value.length < 2) return "Course name must be at least 2 characters.";
    return "";
  }
};

function getFieldValue(fieldName) {
  return fields[fieldName].value.trim().replace(/\s+/g, " ");
}

function validateField(fieldName) {
  const input = fields[fieldName];
  const errorMessage = validators[fieldName](getFieldValue(fieldName));
  const errorElement = document.querySelector(`#${fieldName}Error`);

  input.classList.toggle("is-invalid", Boolean(errorMessage));
  input.classList.toggle("is-valid", !errorMessage && Boolean(getFieldValue(fieldName)));
  input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
  errorElement.textContent = errorMessage;

  return !errorMessage;
}

function validateForm() {
  return Object.keys(fields).map(validateField).every(Boolean);
}

function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = `alert alert-${type}`;
}

function hideAlert() {
  formAlert.textContent = "";
  formAlert.className = "alert d-none";
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function createStudentCell(student) {
  const cell = document.createElement("td");
  const name = document.createElement("span");
  const email = document.createElement("span");

  name.className = "student-name";
  name.textContent = student.fullName;
  name.title = student.fullName;
  email.className = "student-email";
  email.textContent = student.email;
  email.title = student.email;
  cell.append(name, email);

  return cell;
}

function createCourseCell(courseName) {
  const cell = document.createElement("td");
  const tag = document.createElement("span");

  tag.className = "course-tag";
  tag.textContent = courseName;
  tag.title = courseName;
  cell.append(tag);

  return cell;
}

function createActionsCell(index) {
  const cell = document.createElement("td");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  cell.className = "text-end";

  editButton.type = "button";
  editButton.className = "btn btn-sm btn-outline-primary action-button me-1";
  editButton.textContent = "Edit";
  editButton.dataset.action = "edit";
  editButton.dataset.index = index;
  editButton.setAttribute("aria-label", `Edit student ${students[index].fullName}`);

  deleteButton.type = "button";
  deleteButton.className = "btn btn-sm btn-outline-danger action-button";
  deleteButton.textContent = "Delete";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.index = index;
  deleteButton.setAttribute("aria-label", `Delete student ${students[index].fullName}`);

  cell.append(editButton, deleteButton);
  return cell;
}

function renderStudents() {
  studentTableBody.replaceChildren();

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.append(
      createCell(String(index + 1)),
      createStudentCell(student),
      createCell(student.phone),
      createCourseCell(student.course),
      createActionsCell(index)
    );
    studentTableBody.append(row);
  });

  emptyState.classList.toggle("d-none", students.length > 0);
  recordCount.textContent = `${students.length} ${students.length === 1 ? "student" : "students"}`;
}

function resetForm() {
  studentForm.reset();
  Object.values(fields).forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
    input.removeAttribute("aria-invalid");
  });
  document.querySelectorAll(".invalid-feedback").forEach((element) => {
    element.textContent = "";
  });
}

function exitEditMode() {
  editingIndex = null;
  formTitle.textContent = "Add a student";
  submitButton.textContent = "Register Student";
  cancelEditButton.classList.add("d-none");
  resetForm();
}

function startEditing(index) {
  const student = students[index];
  editingIndex = index;

  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].value = student[fieldName];
    fields[fieldName].classList.remove("is-valid", "is-invalid");
  });

  hideAlert();
  formTitle.textContent = "Update student";
  submitButton.textContent = "Save Changes";
  cancelEditButton.classList.remove("d-none");
  fields.fullName.focus();
  studentForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteStudent(index) {
  const deletedName = students[index].fullName;
  students.splice(index, 1);

  if (editingIndex === index) {
    exitEditMode();
  } else if (editingIndex !== null && editingIndex > index) {
    editingIndex -= 1;
  }

  renderStudents();
  showAlert(`${deletedName} was removed from the records.`, "warning");
}

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hideAlert();

  if (!validateForm()) {
    showAlert("Please correct the highlighted fields.", "danger");
    document.querySelector(".is-invalid")?.focus();
    return;
  }

  const student = Object.fromEntries(
    Object.keys(fields).map((fieldName) => [fieldName, getFieldValue(fieldName)])
  );

  if (editingIndex === null) {
    students.push(student);
    resetForm();
    showAlert(`${student.fullName} was registered successfully.`, "success");
  } else {
    students[editingIndex] = student;
    exitEditMode();
    showAlert(`${student.fullName}'s record was updated successfully.`, "success");
  }

  renderStudents();
});

studentTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  if (button.dataset.action === "edit") startEditing(index);
  if (button.dataset.action === "delete") deleteStudent(index);
});

Object.keys(fields).forEach((fieldName) => {
  fields[fieldName].addEventListener("blur", () => validateField(fieldName));
  fields[fieldName].addEventListener("input", () => {
    if (fields[fieldName].classList.contains("is-invalid")) {
      validateField(fieldName);
    }
    hideAlert();
  });
});

cancelEditButton.addEventListener("click", () => {
  exitEditMode();
  hideAlert();
});

renderStudents();
