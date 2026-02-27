// addpatient.js — Admin add patient logic

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('addPatientForm');
  if (form) form.addEventListener('submit', handleAddPatient);
});

async function handleAddPatient(e) {
  e.preventDefault();
  const name      = document.getElementById('name').value.trim();
  const age       = document.getElementById('age').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const password  = document.getElementById('password').value;
  const bloodGroup = document.getElementById('bloodGroup').value;
  const gender    = document.getElementById('gender').value;
  const address   = document.getElementById('address').value.trim();
  const alertBox  = document.getElementById('alertBox');

  if (!name || !age || !phone || !password) {
    alertBox.innerHTML = `<div class="alert alert-danger">Please fill in all required fields.</div>`;
    return;
  }
  if (getPatientByPhone(phone)) {
    alertBox.innerHTML = `<div class="alert alert-warning">Phone <strong>${phone}</strong> already registered.</div>`;
    return;
  }

  const hashedPassword = await hashPassword(password);

  const patient = {
    id: generateId(), name, age, phone,
    password: hashedPassword,
    bloodGroup: bloodGroup || 'Not specified',
    gender: gender || 'Not specified',
    address: address || 'Not provided',
    registeredAt: new Date().toISOString(),
    addedBy: 'admin'
  };
  addPatient(patient);

  alertBox.innerHTML = `
    <div class="alert alert-success">
      <i class="bi bi-check-circle me-2"></i>
      Patient <strong>${name}</strong> added! ID: <code>${patient.id}</code>
    </div>`;
  document.getElementById('addPatientForm').reset();
}