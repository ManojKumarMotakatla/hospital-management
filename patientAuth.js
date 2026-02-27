// patientAuth.js — Registration, login, hashing, session

// ─── Password Hashing ─────────────────────────────────────────
// Uses SHA-256 via Web Crypto API (works on localhost + https)
// Falls back to a simple hash for plain file:// opening
async function hashPassword(password) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // crypto.subtle not available (file:// protocol)
  }
  // Fallback: simple deterministic hash for demo/file:// mode
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const chr = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16) + '_' + password.length;
}

// ─── Register ─────────────────────────────────────────────────
async function registerPatient(name, age, phone, password) {
  if (!name || !age || !phone || !password)
    return { success: false, message: 'All fields are required.' };

  const existing = getPatientByPhone(phone);
  if (existing)
    return { success: false, message: 'Phone number already registered.' };

  const hashedPwd = await hashPassword(password);

  const patient = {
    id:           generateId(),
    name:         name,
    age:          age,
    phone:        phone,
    password:     hashedPwd,
    registeredAt: new Date().toISOString()
  };

  addPatient(patient);
  return { success: true };
}

// ─── Login ────────────────────────────────────────────────────
async function loginPatient(phone, password) {
  if (!phone || !password)
    return { success: false, message: 'Phone and password are required.' };

  const patient = getPatientByPhone(phone);
  if (!patient)
    return { success: false, message: 'No account found for this phone number.' };

  const hashedPwd = await hashPassword(password);
  if (patient.password !== hashedPwd)
    return { success: false, message: 'Incorrect password. Please try again.' };

  // Save session (never store raw password)
  const sessionData = {
    id:           patient.id,
    name:         patient.name,
    age:          patient.age,
    phone:        patient.phone,
    registeredAt: patient.registeredAt
  };
  localStorage.setItem('medicare_session', JSON.stringify(sessionData));

  return { success: true };
}