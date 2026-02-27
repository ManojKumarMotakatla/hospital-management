// dashboard.js — Admin dashboard logic

document.addEventListener('DOMContentLoaded', function () {
  loadStats();
  setupPatientsModal();
  setupAppointmentsTab();
});

// ─── STATS ───────────────────────────────────────────────────
function loadStats() {
  const patients = getPatients();
  const appts    = getAppointments();

  const el = id => document.getElementById(id);
  if (el('totalPatients'))   el('totalPatients').textContent   = patients.length;
  if (el('totalAppts'))      el('totalAppts').textContent      = appts.length;
  if (el('visitedCount'))    el('visitedCount').textContent    = appts.filter(a => a.status === 'VISITED').length;
  if (el('bookedCount'))     el('bookedCount').textContent     = appts.filter(a => a.status === 'BOOKED').length;
  if (el('postponedCount'))  el('postponedCount').textContent  =
    appts.filter(a => a.status === 'POSTPONED_BY_DOCTOR' || a.status === 'POSTPONED_BY_PATIENT').length;
}

// ─── PATIENTS TABLE ──────────────────────────────────────────
function setupPatientsModal() {
  const modal = document.getElementById('patientsModal');
  if (!modal) return;
  modal.addEventListener('show.bs.modal', renderPatientsTable);
}

function renderPatientsTable() {
  const container = document.getElementById('patientTableContainer');
  if (!container) return;
  const patients = getPatients();
  if (!patients.length) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-people fs-1 text-muted"></i>
        <p class="text-muted mt-2">No patients yet.</p>
        <a href="add-patient.html" class="btn btn-dark btn-sm">Add First Patient</a>
      </div>`;
    return;
  }
  container.innerHTML = `
    <input type="text" class="form-control mb-3" placeholder="Search by name or phone…"
      oninput="filterPatients(this.value)">
    <div class="table-responsive" id="tableWrapper">${buildPatientTable(patients)}</div>`;
}

function buildPatientTable(patients) {
  return `
    <table class="table table-hover align-middle mb-0">
      <thead class="table-dark">
        <tr><th>#</th><th>ID</th><th>Name</th><th>Age</th><th>Phone</th><th>Registered</th><th></th></tr>
      </thead>
      <tbody>
        ${patients.map((p, i) => `
          <tr>
            <td>${i + 1}</td>
            <td><code class="small">${p.id}</code></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.age}</td>
            <td>${p.phone}</td>
            <td>${new Date(p.registeredAt).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-sm btn-outline-danger" onclick="confirmDeletePatient('${p.id}')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function filterPatients(q) {
  const patients = getPatients().filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q));
  const w = document.getElementById('tableWrapper');
  if (w) w.innerHTML = buildPatientTable(patients);
}

function confirmDeletePatient(id) {
  if (confirm('Delete this patient and all their appointments?')) {
    deletePatient(id);
    saveAppointments(getAppointments().filter(a => a.patientId !== id));
    renderPatientsTable();
    loadStats();
  }
}

// ─── APPOINTMENTS TAB ─────────────────────────────────────────
function setupAppointmentsTab() {
  renderAdminAppointments();
}

function renderAdminAppointments(filterStatus = 'ALL') {
  const container = document.getElementById('adminApptsContainer');
  if (!container) return;

  let appts = getAppointments();
  if (filterStatus !== 'ALL') appts = appts.filter(a => a.status === filterStatus);

  // Sort: newest first
  appts.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

  if (!appts.length) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-calendar-x fs-1 text-muted"></i>
        <p class="text-muted mt-2">No appointments found.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th>Appt ID</th><th>Patient</th><th>Doctor</th><th>Hospital</th>
            <th>Date & Time</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appts.map(a => `
            <tr>
              <td><code class="small">${a.id.slice(-8)}</code></td>
              <td>
                <strong>${a.patientName}</strong>
                <small class="d-block text-muted">${a.patientPhone}</small>
              </td>
              <td>
                <strong>${a.doctorName}</strong>
                <small class="d-block text-muted">${a.specialization}</small>
              </td>
              <td><small>${a.hospitalName}</small></td>
              <td>
                <strong>${formatDate(a.consultDate)}</strong>
                <small class="d-block text-muted">${a.consultTime}</small>
              </td>
              <td>${statusBadgeHTML(a.status)}</td>
              <td>
                <div class="d-flex gap-1 flex-wrap">
                  ${a.status === 'BOOKED' || a.status.startsWith('POSTPONED') ? `
                    <button class="btn btn-xs btn-success" title="Confirm Visit"
                      onclick="adminConfirmVisit('${a.id}')">
                      <i class="bi bi-qr-code-scan"></i>
                    </button>
                    <button class="btn btn-xs btn-warning" title="Postpone (Doctor)"
                      onclick="adminPostponeModal('${a.id}')">
                      <i class="bi bi-clock-history"></i>
                    </button>
                  ` : ''}
                  <button class="btn btn-xs btn-danger" title="Delete"
                    onclick="adminDeleteAppt('${a.id}')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function adminConfirmVisit(id) {
  confirmVisit(id);
  renderAdminAppointments(document.getElementById('apptFilterStatus')?.value || 'ALL');
  loadStats();
  showToast('Patient visit confirmed!', 'success');
}

function adminDeleteAppt(id) {
  if (confirm('Delete this appointment?')) {
    deleteAppointment(id);
    renderAdminAppointments(document.getElementById('apptFilterStatus')?.value || 'ALL');
    loadStats();
  }
}

// ─── DOCTOR POSTPONE ─────────────────────────────────────────
let _adminPostponeId = null;

function adminPostponeModal(id) {
  _adminPostponeId = id;
  const appt = getAppointmentById(id);
  if (!appt) return;

  document.getElementById('docPostponeInfo').innerHTML =
    `<strong>${appt.patientName}</strong> — ${appt.doctorName}<br>
     Current: ${formatDate(appt.consultDate)} ${appt.consultTime}`;

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('docNewDate').min = today;
  document.getElementById('docNewDate').value = '';
  document.getElementById('docNewTime').value = '';
  document.getElementById('docPostponeAlert').innerHTML = '';

  new bootstrap.Modal(document.getElementById('docPostponeModal')).show();
}

function submitDocPostpone() {
  const date = document.getElementById('docNewDate').value;
  const time = document.getElementById('docNewTime').value;
  const alertEl = document.getElementById('docPostponeAlert');

  if (!date || !time) {
    alertEl.innerHTML = `<div class="alert alert-danger py-2">Select new date and time.</div>`;
    return;
  }

  postponeByDoctor(_adminPostponeId, date, time);
  bootstrap.Modal.getInstance(document.getElementById('docPostponeModal')).hide();

  const filterVal = document.getElementById('apptFilterStatus')?.value || 'ALL';
  renderAdminAppointments(filterVal);
  loadStats();
  showToast('Appointment postponed by doctor.', 'warning');
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg, type = 'primary') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999';
    document.body.appendChild(container);
  }
  const id = 'toast-' + Date.now();
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" data-bs-autohide="true" data-bs-delay="3500">
      <div class="d-flex">
        <div class="toast-body fw-semibold">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);
  new bootstrap.Toast(document.getElementById(id)).show();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
