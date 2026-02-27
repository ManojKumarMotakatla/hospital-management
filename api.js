// ============================================================
// api.js — LocalStorage CRUD: Patients + Appointments
// ============================================================

const PATIENTS_KEY     = 'medicare_patients';
const APPOINTMENTS_KEY = 'medicare_appointments';
const SESSION_KEY      = 'medicare_session';

// ─── PATIENT HELPERS ─────────────────────────────────────────
function getPatients() {
  return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
}
function savePatients(list) {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(list));
}
function addPatient(patient) {
  const list = getPatients();
  list.push(patient);
  savePatients(list);
}
function getPatientByPhone(phone) {
  return getPatients().find(p => p.phone === phone) || null;
}
function getPatientById(id) {
  return getPatients().find(p => p.id === id) || null;
}
function deletePatient(id) {
  savePatients(getPatients().filter(p => p.id !== id));
}

// ─── APPOINTMENT HELPERS ─────────────────────────────────────
function getAppointments() {
  return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
}
function saveAppointments(list) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
}

function createAppointment(appt) {
  const list = getAppointments();
  const record = {
    id:             'APT-' + Date.now() + '-' + Math.floor(Math.random() * 9000 + 1000),
    patientId:      appt.patientId,
    patientName:    appt.patientName,
    patientPhone:   appt.patientPhone,
    doctorName:     appt.doctorName,
    specialization: appt.specialization,
    hospitalName:   appt.hospitalName,
    consultDate:    appt.consultDate,
    consultTime:    appt.consultTime,
    status:         'BOOKED',
    bookedAt:       new Date().toISOString(),
    updatedAt:      new Date().toISOString()
  };
  list.push(record);
  saveAppointments(list);
  return record;
}

function getAppointmentById(id) {
  return getAppointments().find(a => a.id === id) || null;
}

function getAppointmentsByPatientId(patientId) {
  return getAppointments().filter(a => a.patientId === patientId);
}

function updateAppointment(id, changes) {
  const list = getAppointments().map(a => {
    if (a.id === id) return { ...a, ...changes, updatedAt: new Date().toISOString() };
    return a;
  });
  saveAppointments(list);
  return list.find(a => a.id === id) || null;
}

function deleteAppointment(id) {
  saveAppointments(getAppointments().filter(a => a.id !== id));
}

// ─── STATUS TRANSITIONS ──────────────────────────────────────
const APPT_STATUS = {
  BOOKED:               'BOOKED',
  VISITED:              'VISITED',
  NOT_VISITED:          'NOT_VISITED',
  POSTPONED_BY_PATIENT: 'POSTPONED_BY_PATIENT',
  POSTPONED_BY_DOCTOR:  'POSTPONED_BY_DOCTOR'
};

function confirmVisit(appointmentId) {
  return updateAppointment(appointmentId, { status: APPT_STATUS.VISITED });
}
function markNotVisited(appointmentId) {
  return updateAppointment(appointmentId, { status: APPT_STATUS.NOT_VISITED });
}
function postponeByPatient(appointmentId, newDate, newTime) {
  return updateAppointment(appointmentId, {
    status: APPT_STATUS.POSTPONED_BY_PATIENT,
    consultDate: newDate,
    consultTime: newTime
  });
}
function postponeByDoctor(appointmentId, newDate, newTime) {
  return updateAppointment(appointmentId, {
    status: APPT_STATUS.POSTPONED_BY_DOCTOR,
    consultDate: newDate,
    consultTime: newTime
  });
}

// ─── BADGE HTML HELPER ────────────────────────────────────────
function statusBadgeHTML(status) {
  const map = {
    BOOKED:               ['primary', 'bi-calendar-check',    'BOOKED'],
    VISITED:              ['success', 'bi-check-circle-fill', 'VISITED'],
    NOT_VISITED:          ['danger',  'bi-x-circle-fill',     'NOT VISITED'],
    POSTPONED_BY_PATIENT: ['warning', 'bi-clock-history',     'POSTPONED (Patient)'],
    POSTPONED_BY_DOCTOR:  ['warning', 'bi-clock-history',     'POSTPONED (Doctor)']
  };
  const [color, icon, label] = map[status] || ['secondary', 'bi-question', status];
  return `<span class="badge bg-${color} text-${color === 'warning' ? 'dark' : 'white'}"><i class="bi ${icon} me-1"></i>${label}</span>`;
}

// ─── MISC ─────────────────────────────────────────────────────
function generateId() {
  return 'PAT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}
function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}
function setSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}