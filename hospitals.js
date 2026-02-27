// ============================================================
// hospitals.js — Hospital data, Doctor availability, Booking UI
// ============================================================

const HOSPITALS = [
  {
    id: 1,
    name: "City General Hospital",
    location: "Downtown, Main Street",
    speciality: "Multi-speciality",
    beds: 500,
    icon: "bi-building-cross",
    color: "primary",
    doctors: [
      {
        name: "Dr. Arjun Sharma",
        specialization: "Cardiologist",
        experience: "15 years",
        available: true,
        slots: ["09:00 AM","10:00 AM","11:00 AM","02:00 PM","04:00 PM"]
      },
      {
        name: "Dr. Priya Patel",
        specialization: "Neurologist",
        experience: "12 years",
        available: false,
        slots: []
      },
      {
        name: "Dr. Ravi Kumar",
        specialization: "Orthopedic",
        experience: "10 years",
        available: true,
        slots: ["10:30 AM","01:00 PM","03:30 PM"]
      }
    ]
  },
  {
    id: 2,
    name: "Apollo Care Center",
    location: "Banjara Hills, Hyderabad",
    speciality: "Cardiac & Neuro",
    beds: 350,
    icon: "bi-heart-pulse",
    color: "danger",
    doctors: [
      {
        name: "Dr. Sunita Reddy",
        specialization: "Cardiologist",
        experience: "18 years",
        available: true,
        slots: ["08:00 AM","09:30 AM","11:00 AM","03:00 PM"]
      },
      {
        name: "Dr. Kiran Mehta",
        specialization: "Pulmonologist",
        experience: "9 years",
        available: true,
        slots: ["10:00 AM","12:00 PM","04:00 PM"]
      },
      {
        name: "Dr. Anjali Singh",
        specialization: "Endocrinologist",
        experience: "11 years",
        available: false,
        slots: []
      }
    ]
  },
  {
    id: 3,
    name: "Sunrise Medical Institute",
    location: "Jubilee Hills, Hyderabad",
    speciality: "Oncology & Surgery",
    beds: 400,
    icon: "bi-sunrise",
    color: "warning",
    doctors: [
      {
        name: "Dr. Vikram Nair",
        specialization: "Oncologist",
        experience: "20 years",
        available: true,
        slots: ["09:00 AM","11:30 AM","02:00 PM"]
      },
      {
        name: "Dr. Meena Iyer",
        specialization: "General Surgeon",
        experience: "14 years",
        available: false,
        slots: []
      },
      {
        name: "Dr. Rohit Das",
        specialization: "Radiologist",
        experience: "8 years",
        available: true,
        slots: ["08:30 AM","10:00 AM","01:30 PM","03:00 PM"]
      }
    ]
  },
  {
    id: 4,
    name: "Green Valley Hospital",
    location: "Secunderabad, Hyderabad",
    speciality: "Paediatrics & Maternity",
    beds: 250,
    icon: "bi-tree",
    color: "success",
    doctors: [
      {
        name: "Dr. Nisha Verma",
        specialization: "Paediatrician",
        experience: "13 years",
        available: true,
        slots: ["09:00 AM","10:30 AM","12:00 PM","04:30 PM"]
      },
      {
        name: "Dr. Suresh Rao",
        specialization: "Gynaecologist",
        experience: "16 years",
        available: true,
        slots: ["11:00 AM","01:00 PM","03:00 PM"]
      },
      {
        name: "Dr. Lakshmi Prasad",
        specialization: "Neonatologist",
        experience: "7 years",
        available: false,
        slots: []
      }
    ]
  },
  {
    id: 5,
    name: "Metro Diagnostics & Hospital",
    location: "Kukatpally, Hyderabad",
    speciality: "Diagnostics & Emergency",
    beds: 300,
    icon: "bi-activity",
    color: "info",
    doctors: [
      {
        name: "Dr. Anil Kapoor",
        specialization: "Emergency Medicine",
        experience: "11 years",
        available: true,
        slots: ["08:00 AM","10:00 AM","12:00 PM","02:00 PM","04:00 PM","06:00 PM"]
      },
      {
        name: "Dr. Divya Thomas",
        specialization: "Pathologist",
        experience: "9 years",
        available: false,
        slots: []
      },
      {
        name: "Dr. Manoj Gupta",
        specialization: "Radiologist",
        experience: "12 years",
        available: true,
        slots: ["09:30 AM","11:30 AM","02:30 PM"]
      }
    ]
  }
];

// Active booking context
let _bookingContext = {};

// ─── RENDER HOSPITAL CARDS ────────────────────────────────────
function renderHospitals() {
  const container = document.getElementById('hospitalList');
  if (!container) return;

  container.innerHTML = HOSPITALS.map(h => `
    <div class="col-md-6 col-lg-4">
      <div class="card hospital-card shadow-sm h-100 border-0">
        <div class="card-body p-4">
          <div class="d-flex align-items-center mb-3">
            <div class="hosp-icon-wrap bg-${h.color} bg-opacity-10 rounded-circle p-3 me-3">
              <i class="bi ${h.icon} fs-3 text-${h.color}"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0">${h.name}</h5>
              <small class="text-muted"><i class="bi bi-geo-alt me-1"></i>${h.location}</small>
            </div>
          </div>
          <div class="mb-3 d-flex flex-wrap gap-2">
            <span class="badge bg-${h.color} bg-opacity-10 text-${h.color} border border-${h.color} border-opacity-25">${h.speciality}</span>
            <span class="badge bg-light text-dark"><i class="bi bi-hospital me-1"></i>${h.beds} Beds</span>
          </div>
          <div class="doctor-availability-row mb-3">
            ${h.doctors.map(d => `
              <span class="avail-dot ${d.available ? 'bg-success' : 'bg-secondary'}"
                    title="${d.name} — ${d.available ? 'Available' : 'Unavailable'}"></span>
            `).join('')}
            <small class="text-muted ms-1">${h.doctors.filter(d=>d.available).length}/${h.doctors.length} available</small>
          </div>
          <button class="btn btn-outline-${h.color} w-100 fw-semibold" onclick="openDoctorsModal(${h.id})">
            <i class="bi bi-person-badge me-1"></i>View Doctors & Book
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Init Bootstrap tooltips
  [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .forEach(el => new bootstrap.Tooltip(el));
}

// ─── DOCTORS MODAL ────────────────────────────────────────────
function openDoctorsModal(hospitalId) {
  const hospital = HOSPITALS.find(h => h.id === hospitalId);
  if (!hospital) return;

  document.getElementById('doctorsModalLabel').innerHTML =
    `<i class="bi bi-hospital me-2"></i>${hospital.name}`;

  const body = document.getElementById('doctorsModalBody');
  body.innerHTML = `
    <p class="text-muted mb-3"><i class="bi bi-geo-alt me-1"></i>${hospital.location}</p>
    <div class="row g-3">
      ${hospital.doctors.map((d, idx) => buildDoctorCard(d, idx, hospital)).join('')}
    </div>
  `;

  // Re-init tooltips inside modal
  body.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

  new bootstrap.Modal(document.getElementById('doctorsModal')).show();
}

function buildDoctorCard(d, idx, hospital) {
  const disabled = !d.available;
  return `
    <div class="col-md-6">
      <div class="card h-100 border-0 shadow-sm ${disabled ? 'opacity-50' : ''}" style="${disabled ? 'filter:grayscale(60%)' : ''}">
        <div class="card-body p-3">
          <div class="d-flex align-items-center mb-2">
            <div class="doc-avatar me-2 ${disabled ? 'bg-secondary' : 'bg-primary'} text-white rounded-circle d-flex align-items-center justify-content-center" style="width:42px;height:42px;font-size:1.1rem">
              ${d.name.split(' ').slice(-1)[0].charAt(0)}
            </div>
            <div>
              <strong class="d-block lh-sm">${d.name}</strong>
              <small class="text-${disabled ? 'muted' : 'primary'}">${d.specialization}</small>
            </div>
            <div class="ms-auto">
              <span class="badge ${d.available ? 'bg-success' : 'bg-secondary'}">
                <i class="bi bi-circle-fill me-1" style="font-size:.45rem;vertical-align:middle"></i>
                ${d.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
          <small class="text-muted d-block mb-2"><i class="bi bi-briefcase me-1"></i>${d.experience}</small>
          ${d.available ? `
            <div class="mb-2">
              <small class="text-muted fw-semibold">Time Slots:</small>
              <div class="d-flex flex-wrap gap-1 mt-1">
                ${d.slots.map(s => `<span class="slot-chip badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1" style="cursor:pointer;font-size:.75rem" onclick="selectSlot(this,'${s}')">${s}</span>`).join('')}
              </div>
            </div>
            <button class="btn btn-primary btn-sm w-100 mt-1 fw-semibold book-btn"
              onclick="openBookingForm('${hospital.name}', '${d.name}', '${d.specialization}', ${idx})">
              <i class="bi bi-calendar-plus me-1"></i>Book Appointment
            </button>
          ` : `
            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Doctor not available">
              <button class="btn btn-secondary btn-sm w-100 mt-1 fw-semibold" disabled>
                <i class="bi bi-slash-circle me-1"></i>Not Available
              </button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function selectSlot(el, slot) {
  el.closest('.d-flex').querySelectorAll('.slot-chip').forEach(c => {
    c.classList.remove('bg-primary','text-white');
    c.classList.add('bg-primary','bg-opacity-10','text-primary');
  });
  el.classList.remove('bg-opacity-10','text-primary');
  el.classList.add('text-white');
  _bookingContext.selectedSlot = slot;
  document.getElementById('bookTime') && (document.getElementById('bookTime').value = slot);
}

// ─── BOOKING FORM MODAL ───────────────────────────────────────
function openBookingForm(hospitalName, doctorName, specialization, idx) {

  // ── LOGIN GUARD: block booking if not logged in ──────────────
  const session = getSession();
  if (!session) {
    // Hide doctors modal first
    const doctorsModalEl = document.getElementById('doctorsModal');
    const doctorsModal = bootstrap.Modal.getInstance(doctorsModalEl);
    if (doctorsModal) doctorsModal.hide();

    // Show login warning modal
    document.getElementById('bookingModalLabel').innerHTML =
      `<i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Login Required`;
    document.getElementById('bookingModalBody').innerHTML = `
      <div class="text-center py-3">
        <div class="mb-3">
          <i class="bi bi-lock-fill text-warning" style="font-size:3.5rem"></i>
        </div>
        <h5 class="fw-bold mb-2">You are not logged in!</h5>
        <p class="text-muted mb-4">Please login or register to book an appointment with<br>
          <strong>${doctorName}</strong> at <strong>${hospitalName}</strong>.
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <a href="auth/patient-login.html" class="btn btn-primary fw-semibold px-4">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
          </a>
          <a href="auth/patient-register.html" class="btn btn-outline-primary fw-semibold px-4">
            <i class="bi bi-person-plus me-1"></i>Register
          </a>
        </div>
      </div>
    `;
    // Hide the confirm button since it's not needed here
    const bookingModalEl = document.getElementById('bookingModal');
    bookingModalEl.querySelector('#confirmBookingBtn').style.display = 'none';
    new bootstrap.Modal(bookingModalEl).show();
    return;
  }

  // ── User is logged in — show booking form ────────────────────
  _bookingContext = { hospitalName, doctorName, specialization, selectedSlot: null };

  // Hide doctors modal first
  const doctorsModalEl = document.getElementById('doctorsModal');
  const doctorsModal = bootstrap.Modal.getInstance(doctorsModalEl);
  if (doctorsModal) doctorsModal.hide();

  // Get the hospital's doctor slots
  const hospital = HOSPITALS.find(h => h.name === hospitalName);
  const doc = hospital ? hospital.doctors.find(d => d.name === doctorName) : null;
  const slots = doc ? doc.slots : [];

  const today = new Date().toISOString().split('T')[0];

  document.getElementById('bookingModalLabel').innerHTML =
    `<i class="bi bi-calendar-plus me-2"></i>Book Appointment`;
  document.getElementById('bookingModalBody').innerHTML = `
    <div class="p-2">
      <div class="alert alert-primary border-0 rounded-3 mb-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-hospital fs-4 me-3"></i>
          <div>
            <strong class="d-block">${doctorName}</strong>
            <small>${specialization} &bull; ${hospitalName}</small>
          </div>
        </div>
      </div>
      <div id="bookingAlert"></div>
      <div class="mb-3">
        <label class="form-label fw-semibold">Consulting Date <span class="text-danger">*</span></label>
        <input type="date" class="form-control" id="bookDate" min="${today}" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">Select Time Slot <span class="text-danger">*</span></label>
        <select class="form-select" id="bookTime">
          <option value="">-- Choose time slot --</option>
          ${slots.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
    </div>
  `;

  const bookingModalEl = document.getElementById('bookingModal');
  bookingModalEl.querySelector('#confirmBookingBtn').style.display = '';
  bookingModalEl.querySelector('#confirmBookingBtn').onclick = confirmBooking;
  new bootstrap.Modal(bookingModalEl).show();
}

async function confirmBooking() {
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  const alertEl = document.getElementById('bookingAlert');

  if (!date || !time) {
    alertEl.innerHTML = `<div class="alert alert-danger py-2">Please select date and time slot.</div>`;
    return;
  }

  const session = getSession();
  if (!session) {
    alertEl.innerHTML = `<div class="alert alert-warning py-2">Please <a href="auth/patient-login.html">login</a> to book an appointment.</div>`;
    return;
  }

  const appt = createAppointment({
    patientId:      session.id,
    patientName:    session.name,
    patientPhone:   session.phone,
    doctorName:     _bookingContext.doctorName,
    specialization: _bookingContext.specialization,
    hospitalName:   _bookingContext.hospitalName,
    consultDate:    date,
    consultTime:    time
  });

  // Hide booking modal
  bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();

  // Show confirmation card with QR
  showConfirmationCard(appt);
}

// ─── CONFIRMATION CARD WITH QR ────────────────────────────────
function showConfirmationCard(appt) {
  const qrData = encodeURIComponent(`${appt.id}|${appt.patientName}|${appt.doctorName}|${appt.consultDate} ${appt.consultTime}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  document.getElementById('confirmationModalBody').innerHTML = `
    <div class="text-center mb-4">
      <div class="success-pulse mb-3">
        <i class="bi bi-check-circle-fill text-success" style="font-size:3rem"></i>
      </div>
      <h5 class="fw-bold text-success">Doctor Booked Successfully!</h5>
      <p class="text-muted small">Save this confirmation card for your hospital visit.</p>
    </div>

    <div class="appt-card border rounded-3 p-4 mb-3" style="background:linear-gradient(135deg,#f8fbff,#e8f4fd);border-color:#0d6efd33!important">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6 class="fw-bold text-primary mb-0">${appt.hospitalName}</h6>
          <small class="text-muted">Appointment Receipt</small>
        </div>
        <span class="badge bg-primary">BOOKED</span>
      </div>
      <hr class="my-2">
      <div class="row g-2 mb-3">
        <div class="col-6"><small class="text-muted d-block">Patient Name</small><strong>${appt.patientName}</strong></div>
        <div class="col-6"><small class="text-muted d-block">Phone</small><strong>${appt.patientPhone}</strong></div>
        <div class="col-6"><small class="text-muted d-block">Doctor</small><strong>${appt.doctorName}</strong></div>
        <div class="col-6"><small class="text-muted d-block">Specialization</small><strong>${appt.specialization}</strong></div>
        <div class="col-6"><small class="text-muted d-block">Date</small><strong>${formatDate(appt.consultDate)}</strong></div>
        <div class="col-6"><small class="text-muted d-block">Time</small><strong>${appt.consultTime}</strong></div>
      </div>
      <div class="text-center border-top pt-3">
        <small class="text-muted d-block mb-2 fw-semibold">Scan at Reception</small>
        <img src="${qrUrl}" alt="QR Code" class="rounded" style="width:120px;height:120px" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><rect width=%22120%22 height=%22120%22 fill=%22%23f8f9fa%22/><text x=%2260%22 y=%2265%22 text-anchor=%22middle%22 fill=%22%230d6efd%22 font-size=%2210%22>QR CODE</text></svg>'">
        <p class="text-muted mt-2 mb-0" style="font-size:.7rem;font-family:monospace">${appt.id}</p>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-outline-success btn-sm flex-grow-1" onclick="simulateQRScan('${appt.id}')">
        <i class="bi bi-qr-code-scan me-1"></i>Simulate QR Scan (Mark Visited)
      </button>
      <a href="patient/patient-dashboard.html" class="btn btn-primary btn-sm flex-grow-1">
        <i class="bi bi-speedometer2 me-1"></i>My Dashboard
      </a>
    </div>
  `;

  new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function simulateQRScan(apptId) {
  confirmVisit(apptId);
  const btn = event.target.closest('button');
  if (btn) {
    btn.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i>Visit Confirmed!`;
    btn.className = 'btn btn-success btn-sm flex-grow-1';
    btn.disabled = true;
  }
  // Update badge in card
  const badge = document.querySelector('.appt-card .badge');
  if (badge) { badge.className = 'badge bg-success'; badge.textContent = 'VISITED'; }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', renderHospitals);