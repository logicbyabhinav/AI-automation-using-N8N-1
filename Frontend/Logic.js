// ============================================================
// AI Automation - N8N Client Intake
// Logic.js — Validation, State Management, Step Guards
// ============================================================

const STORAGE_KEY = 'ai_automation_form';

// ------------------------------------------------------------
// Utility: Save & Load form data from localStorage
// ------------------------------------------------------------

function saveStep(stepKey, data) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  existing[stepKey] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

function loadStep(stepKey) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return existing[stepKey] || null;
}

function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}

// ------------------------------------------------------------
// Utility: Show inline error under a field
// ------------------------------------------------------------

function showError(input, message) {
  clearError(input);
  input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
  input.classList.remove('border-[#1F6FEB]/20');

  const error = document.createElement('span');
  error.className = 'field-error text-red-400 text-[11px] mt-1';
  error.textContent = message;
  input.parentNode.appendChild(error);
}

function clearError(input) {
  input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
  input.classList.add('border-[#1F6FEB]/20');
  const existing = input.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
}

function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.remove());
  document.querySelectorAll('.border-red-500').forEach(el => {
    el.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    el.classList.add('border-[#1F6FEB]/20');
  });
}

// ------------------------------------------------------------
// Utility: Show toast notification
// ------------------------------------------------------------

function showToast(message, type = 'error') {
  const existing = document.getElementById('toast-msg');
  if (existing) existing.remove();

  const colors = type === 'error'
    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
    : 'bg-green-500/10 border border-green-500/30 text-green-400';

  const toast = document.createElement('div');
  toast.id = 'toast-msg';
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-md text-sm font-bold tracking-wide ${colors} shadow-lg transition-all`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

// ------------------------------------------------------------
// STEP 1 — Personal Details Validation
// ------------------------------------------------------------

function validateStep1() {
  clearAllErrors();
  let valid = true;

  const name = document.getElementById('s1_name');
  const email = document.getElementById('s1_email');
  const phone = document.getElementById('s1_phone');
  const job = document.getElementById('s1_job');
  const company = document.getElementById('s1_company');
  const address = document.getElementById('s1_address');

  if (!name.value.trim()) {
    showError(name, 'Full name is required.');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError(email, 'Email address is required.');
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  }

  const phoneRegex = /^[+\d\s\-().]{7,20}$/;
  if (!phone.value.trim()) {
    showError(phone, 'Phone number is required.');
    valid = false;
  } else if (!phoneRegex.test(phone.value.trim())) {
    showError(phone, 'Please enter a valid phone number.');
    valid = false;
  }

  if (!job.value.trim()) {
    showError(job, 'Job title is required.');
    valid = false;
  }

  if (!company.value.trim()) {
    showError(company, 'Company name is required.');
    valid = false;
  }

  if (!address.value.trim()) {
    showError(address, 'Address is required.');
    valid = false;
  }

  if (valid) {
    saveStep('step1', {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      job: job.value.trim(),
      company: company.value.trim(),
      address: address.value.trim(),
      completed: true
    });
  }

  return valid;
}

function proceedFromStep1() {
  if (validateStep1()) {
    showToast('Step 1 saved!', 'success');
    setTimeout(() => window.location.href = 'STEP02.html', 500);
  } else {
    showToast('Please fill in all required fields.');
  }
}

// ------------------------------------------------------------
// STEP 2 — Project & Website Requirements Validation
// ------------------------------------------------------------

function validateStep2() {
  clearAllErrors();
  let valid = true;

  const type = document.getElementById('s2_type');
  const description = document.getElementById('s2_description');
  const features = document.getElementById('s2_features');
  const design = document.getElementById('s2_design');
  const timeline = document.getElementById('s2_timeline');

  if (!type.value || type.value === '') {
    showError(type, 'Please select a website type.');
    valid = false;
  }

  if (!description.value.trim() || description.value.trim().length < 20) {
    showError(description, 'Please provide a description (at least 20 characters).');
    valid = false;
  }

  if (!features.value.trim()) {
    showError(features, 'Please list at least one key feature.');
    valid = false;
  }

  if (!design.value.trim()) {
    showError(design, 'Please describe your design preferences.');
    valid = false;
  }

  if (!timeline.value || timeline.value === '') {
    showError(timeline, 'Please select a target timeline.');
    valid = false;
  }

  if (valid) {
    const refs = document.getElementById('s2_refs');
    saveStep('step2', {
      type: type.value,
      description: description.value.trim(),
      features: features.value.trim(),
      design: design.value.trim(),
      refs: refs ? refs.value.trim() : '',
      timeline: timeline.value,
      completed: true
    });
  }

  return valid;
}

function proceedFromStep2() {
  if (validateStep2()) {
    showToast('Step 2 saved!', 'success');
    setTimeout(() => window.location.href = 'STEP03.html', 500);
  } else {
    showToast('Please fill in all required fields.');
  }
}

// ------------------------------------------------------------
// STEP 3 — Budget & Team Validation
// ------------------------------------------------------------

function validateStep3() {
  clearAllErrors();
  let valid = true;

  const budget = document.getElementById('s3_budget');
  const payment = document.getElementById('s3_payment');
  const team = document.getElementById('s3_team');

  if (!budget.value || budget.value === '') {
    showError(budget, 'Please select a budget range.');
    valid = false;
  }

  if (!payment.value || payment.value === '') {
    showError(payment, 'Please select a payment preference.');
    valid = false;
  }

  if (!team.value.trim()) {
    showError(team, 'Please describe your developer team conditions.');
    valid = false;
  }

  if (valid) {
    const notes = document.getElementById('s3_notes');
    saveStep('step3', {
      budget: budget.value,
      payment: payment.value,
      team: team.value.trim(),
      notes: notes ? notes.value.trim() : '',
      completed: true
    });
  }

  return valid;
}

function proceedFromStep3() {
  if (validateStep3()) {
    showToast('Step 3 saved!', 'success');
    setTimeout(() => window.location.href = 'STEP04.html', 500);
  } else {
    showToast('Please fill in all required fields.');
  }
}

// ------------------------------------------------------------
// STEP 4 — Review Page: Populate Summary & Final Submit
// ------------------------------------------------------------

function populateReview() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const s1 = data.step1 || {};
  const s2 = data.step2 || {};
  const s3 = data.step3 || {};

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  };

  // Step 1
  set('r_name', s1.name);
  set('r_email', s1.email);
  set('r_phone', s1.phone);
  set('r_job', s1.job);
  set('r_company', s1.company);
  set('r_address', s1.address);

  // Step 2
  const typeLabels = {
    ecommerce: 'E-Commerce Store',
    portfolio: 'Portfolio / Creative Showcase',
    corporate: 'Corporate / Business Site',
    saas: 'SaaS Landing Page',
    blog: 'Blog / Content Platform'
  };
  const timelineLabels = {
    asap: 'ASAP (1-2 weeks)',
    month: 'Within a month',
    quarter: '1-3 months',
    flexible: 'Flexible / Ongoing'
  };
  set('r_type', typeLabels[s2.type] || s2.type);
  set('r_description', s2.description);
  set('r_features', s2.features);
  set('r_design', s2.design);
  set('r_refs', s2.refs || 'None provided');
  set('r_timeline', timelineLabels[s2.timeline] || s2.timeline);

  // Step 3
  const budgetLabels = {
    low: '$1,000 - $5,000',
    medium: '$5,000 - $20,000',
    high: '$20,000 - $50,000',
    enterprise: '$50,000+'
  };
  const paymentLabels = {
    milestone: 'Milestone Based',
    monthly: 'Monthly Retainer',
    upfront: 'Full Upfront',
    split: '50/50 Split'
  };
  set('r_budget', budgetLabels[s3.budget] || s3.budget);
  set('r_payment', paymentLabels[s3.payment] || s3.payment);
  set('r_team', s3.team);
  set('r_notes', s3.notes || 'None');
}

function submitForm() {
  const checkbox = document.getElementById('confirm');
  if (!checkbox || !checkbox.checked) {
    showToast('Please confirm the accuracy of your information.');
    return;
  }

  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  // Final check — all 3 steps must be complete
  if (!data.step1?.completed || !data.step2?.completed || !data.step3?.completed) {
    showToast('Incomplete submission. Please complete all steps.');
    return;
  }

  // Mark as submitted
  data.submitted = true;
  data.submittedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  showToast('Submitting...', 'success');
  setTimeout(() => window.location.href = 'LAST.html', 800);
}

// ------------------------------------------------------------
// STEP GUARD — Block access if previous steps not done
// ------------------------------------------------------------

function guardStep(requiredSteps) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  for (const step of requiredSteps) {
    if (!data[step]?.completed) {
      const stepPage = {
        step1: 'STEP01.html',
        step2: 'STEP02.html',
        step3: 'STEP03.html',
        step4: 'STEP04.html'
      };
      showToast('Please complete the previous step first.');
      setTimeout(() => window.location.href = stepPage[step], 1200);
      return false;
    }
  }
  return true;
}

// ------------------------------------------------------------
// RESTORE — Pre-fill saved values when returning to a step
// ------------------------------------------------------------

function restoreStep1() {
  const d = loadStep('step1');
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('s1_name', d.name);
  set('s1_email', d.email);
  set('s1_phone', d.phone);
  set('s1_job', d.job);
  set('s1_company', d.company);
  set('s1_address', d.address);
}

function restoreStep2() {
  const d = loadStep('step2');
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('s2_type', d.type);
  set('s2_description', d.description);
  set('s2_features', d.features);
  set('s2_design', d.design);
  set('s2_refs', d.refs);
  set('s2_timeline', d.timeline);
}

function restoreStep3() {
  const d = loadStep('step3');
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('s3_budget', d.budget);
  set('s3_payment', d.payment);
  set('s3_team', d.team);
  set('s3_notes', d.notes);
}

// ------------------------------------------------------------
// Clear errors on input change (live feedback)
// ------------------------------------------------------------

function attachLiveValidation() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });
}
