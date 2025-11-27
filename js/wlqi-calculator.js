// Work-Life Quality Index Calculator
// Copyright (c) 2025 QuickCalcLabs. All Rights Reserved.
// Proprietary and Confidential - Unauthorized copying, distribution, or use is strictly prohibited.
// This software contains trade secrets and proprietary algorithms protected by copyright law.

let currentWorkerType = 'remote';
let isTimezoneWork = false;
let radarChartInstance = null;

// Proprietary normalization constants (obfuscated)
const _0x4a2c = [0x2e, 0x3c, 0x4b, 0x5a, 0x69, 0x78, 0x87, 0x96, 0xa5];
const _0x7f3d = { a: 1.247, b: 0.893, c: 1.156, d: 0.734, e: 1.421 };
const _0x9e1b = (v, m) => Math.pow(v / 100, m) * 100;
const _0x3c8f = (s, w) => s * w * _0x7f3d.a + (100 - s) * (1 - w) * _0x7f3d.b;

// Store final score for sharing
let finalWLQIScore = 0;
let finalRatingText = '';

// Anti-tampering protection
(function() {
  'use strict';
  const _0xProtect = () => {
    if (typeof console !== 'undefined' && console.log) {
      console.log('%c⚠️ WARNING: This code is protected by copyright law', 'color: red; font-size: 16px; font-weight: bold;');
      console.log('%c© 2025 QuickCalcLabs - Proprietary & Confidential', 'color: orange; font-size: 14px;');
      console.log('%cUnauthorized access, copying, or reverse engineering is prohibited and may result in legal action.', 'color: red; font-size: 12px;');
    }
  };
  _0xProtect();
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode();
  initializeWorkerTypeSelection();
  initializeTimezoneToggle();
  initializeRangeDisplays();
  initializeFormSubmit();
  initializeQuickFill();
  initializeSocialSharing();
  initializeCollapsibleSections();
  updateConditionalInputs();
});

// Dark mode functionality
function initializeDarkMode() {
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      toggle.textContent = '☀️';
    } else {
      body.classList.remove('dark-mode');
      toggle.textContent = '🌙';
    }
  };

  toggle.addEventListener("click", () => {
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'light');
      applyTheme('light');
    } else {
      localStorage.setItem('theme', 'dark');
      applyTheme('dark');
    }
  });

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

// Worker type selection
function initializeWorkerTypeSelection() {
  const buttons = document.querySelectorAll('.worker-type-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWorkerType = btn.dataset.type;
      updateConditionalInputs();
    });
  });
}

// Timezone work toggle
function initializeTimezoneToggle() {
  const checkbox = document.getElementById('timezoneWork');
  const section = document.getElementById('timezoneSection');
  
  checkbox.addEventListener('change', (e) => {
    isTimezoneWork = e.target.checked;
    if (isTimezoneWork) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
}

// Update conditional inputs based on worker type
function updateConditionalInputs() {
  // Hide all conditional elements first
  document.querySelectorAll('.conditional-remote, .conditional-hybrid, .conditional-onsite, .conditional-onsite-hybrid, .conditional-remote-hybrid').forEach(el => {
    el.classList.add('hidden');
  });
  
  // Show relevant elements based on worker type
  if (currentWorkerType === 'remote') {
    document.querySelectorAll('.conditional-remote, .conditional-remote-hybrid').forEach(el => {
      el.classList.remove('hidden');
    });
  } else if (currentWorkerType === 'hybrid') {
    document.querySelectorAll('.conditional-hybrid, .conditional-onsite-hybrid, .conditional-remote-hybrid').forEach(el => {
      el.classList.remove('hidden');
    });
  } else if (currentWorkerType === 'onsite') {
    document.querySelectorAll('.conditional-onsite, .conditional-onsite-hybrid').forEach(el => {
      el.classList.remove('hidden');
    });
  }
}

// Range input display updates
function initializeRangeDisplays() {
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  
  rangeInputs.forEach(input => {
    const displayId = input.id + 'Val';
    const display = document.getElementById(displayId);
    
    if (display) {
      input.addEventListener('input', (e) => {
        display.textContent = e.target.value;
      });
    }
  });
}

// Form submission
function initializeFormSubmit() {
  const form = document.getElementById('wlqiForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateWLQI();
  });
}

// Quick fill with average values
function initializeQuickFill() {
  const quickFillBtn = document.getElementById('quickFillBtn');
  
  quickFillBtn.addEventListener('click', () => {
    // Fill with reasonable average values
    document.getElementById('hoursWorked').value = 8;
    document.getElementById('deepWorkHours').value = 4;
    document.getElementById('taskCompletion').value = 75;
    document.getElementById('distractionsPerDay').value = 5;
    
    if (currentWorkerType === 'onsite' || currentWorkerType === 'hybrid') {
      document.getElementById('coworkerInterruptions').value = 3;
    }
    if (currentWorkerType === 'remote' || currentWorkerType === 'hybrid') {
      document.getElementById('homeDistractions').value = 3;
    }
    
    document.getElementById('meetingsPerDay').value = 4;
    document.getElementById('avgMeetingDuration').value = 45;
    document.getElementById('bufferTime').value = 10;
    document.getElementById('meetingEnergyDrain').value = 6;
    document.getElementById('asyncSyncRatio').value = 50;
    
    document.getElementById('weeklyHours').value = 45;
    document.getElementById('feelingOverwhelmed').value = 6;
    document.getElementById('sleepHours').value = 7;
    document.getElementById('weekendRecovery').value = 6;
    document.getElementById('emotionalExhaustion').value = 6;
    
    document.getElementById('stepsPerDay').value = 5000;
    document.getElementById('exerciseMinutes').value = 20;
    document.getElementById('neckBackPain').value = 5;
    document.getElementById('eyeStrain').value = 6;
    document.getElementById('deskSetup').value = 6;
    
    document.getElementById('loneliness').value = 5;
    document.getElementById('moodScore').value = 6;
    document.getElementById('socialInteractions').value = 10;
    document.getElementById('workPressure').value = 7;
    
    if (currentWorkerType === 'onsite' || currentWorkerType === 'hybrid') {
      document.getElementById('coworkerQuality').value = 6;
    }
    if (currentWorkerType === 'remote') {
      document.getElementById('virtualSatisfaction').value = 6;
    }
    
    document.getElementById('hoursOutsideSchedule').value = 5;
    document.getElementById('eveningWorkHours').value = 5;
    document.getElementById('weekendWorkHours').value = 3;
    document.getElementById('personalTimeHours').value = 3;
    document.getElementById('offScreenHours').value = 5;
    document.getElementById('boundaryControl').value = 5;
    
    if (currentWorkerType === 'remote') {
      document.getElementById('homeWorkspace').value = 7;
      document.getElementById('lightingScore').value = 7;
      document.getElementById('noiseLevel').value = 5;
      document.getElementById('tempComfort').value = 7;
      document.getElementById('internetStability').value = 8;
      
      document.getElementById('incomeStability').value = 7;
      document.getElementById('financialStress').value = 6;
      document.getElementById('jobSecurity').value = 7;
    } else if (currentWorkerType === 'onsite') {
      document.getElementById('officeNoise').value = 6;
      document.getElementById('workspaceComfort').value = 6;
      document.getElementById('privacyRating').value = 5;
      document.getElementById('commuteEnvironment').value = 5;
      
      document.getElementById('commuteTime').value = 35;
      document.getElementById('commuteCost').value = 200;
      document.getElementById('trafficStress').value = 7;
      document.getElementById('transportReliability').value = 6;
    } else if (currentWorkerType === 'hybrid') {
      document.getElementById('homeWorkspaceHybrid').value = 7;
      document.getElementById('officeComfortHybrid').value = 6;
      
      document.getElementById('commuteTime').value = 30;
      document.getElementById('commuteCost').value = 150;
      document.getElementById('trafficStress').value = 6;
      document.getElementById('transportReliability').value = 7;
    }
    
    if (isTimezoneWork) {
      document.getElementById('timezoneGap').value = 4;
      document.getElementById('requiredOverlap').value = 4;
      document.getElementById('workingHoursStart').value = 9;
      document.getElementById('workingHoursEnd').value = 18;
      document.getElementById('nightWorkDays').value = 1;
      document.getElementById('sleepDisruption').value = 6;
      document.getElementById('familyTimeLoss').value = 6;
      document.getElementById('weekendOnCall').value = 'no';
      document.getElementById('scheduleFlexibility').value = 5;
    }
    
    // Update all range displays
    document.querySelectorAll('input[type="range"]').forEach(input => {
      const displayId = input.id + 'Val';
      const display = document.getElementById(displayId);
      if (display) {
        display.textContent = input.value;
      }
    });
    
    // Show notification
    alert('✅ Form filled with average values! You can now adjust any values before calculating.');
  });
}

// Social sharing functionality
function initializeSocialSharing() {
  document.getElementById('shareLinkedIn').addEventListener('click', () => shareToLinkedIn());
  document.getElementById('shareFacebook').addEventListener('click', () => shareToFacebook());
  document.getElementById('shareTwitter').addEventListener('click', () => shareToTwitter());
  document.getElementById('shareReddit').addEventListener('click', () => shareToReddit());
  document.getElementById('shareWhatsApp').addEventListener('click', () => shareToWhatsApp());
  document.getElementById('shareEmail').addEventListener('click', () => shareToEmail());
}

function getShareText() {
  return `I just assessed my Work-Life Quality! My WLQI score is ${finalWLQIScore}/100 (${finalRatingText}). Calculate yours:`;
}

function getShareUrl() {
  return 'https://quickcalclabs.com/work-life-quality-index.html';
}

function shareToLinkedIn() {
  const url = getShareUrl();
  const text = getShareText();
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToFacebook() {
  const url = getShareUrl();
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToTwitter() {
  const url = getShareUrl();
  const text = getShareText();
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToReddit() {
  const url = getShareUrl();
  const text = getShareText();
  const shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank', 'width=800,height=600');
}

function shareToWhatsApp() {
  const url = getShareUrl();
  const text = `${getShareText()} ${url}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank');
}

function shareToEmail() {
  const url = getShareUrl();
  const subject = 'Check out my Work-Life Quality Index!';
  const body = `${getShareText()}\n\n${url}\n\nQuickCalcLabs offers free calculators to help you understand and improve your work-life quality.`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Collapsible sections functionality
function initializeCollapsibleSections() {
  const toggles = document.querySelectorAll('.section-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const section = toggle.dataset.section;
      const content = document.getElementById(`${section}-content`);
      const icon = toggle.querySelector('.toggle-icon');
      
      if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.classList.remove('collapsed');
      } else {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
      }
    });
  });
}

// Main calculation function
function calculateWLQI() {
  const scores = {
    productivity: calculateProductivityScore(),
    meetings: calculateMeetingBalanceScore(),
    burnout: calculateBurnoutScore(),
    physical: calculatePhysicalHealthScore(),
    mental: calculateMentalWellbeingScore(),
    workLife: calculateWorkLifeBalanceScore(),
    environment: calculateEnvironmentScore(),
    financial: calculateFinancialStressScore(),
    timezone: isTimezoneWork ? calculateTimezoneStressScore() : null
  };

  // Weights (total = 100%)
  const weights = {
    productivity: 0.15,
    meetings: 0.10,
    burnout: 0.20,
    physical: 0.10,
    mental: 0.10,
    workLife: 0.15,
    environment: 0.10,
    financial: 0.10,
    timezone: isTimezoneWork ? 0.10 : 0
  };

  // Adjust weights if no timezone work
  if (!isTimezoneWork) {
    // Redistribute timezone weight proportionally
    const redistributeAmount = 0.10 / 8;
    weights.productivity += redistributeAmount;
    weights.meetings += redistributeAmount;
    weights.burnout += redistributeAmount;
    weights.physical += redistributeAmount;
    weights.mental += redistributeAmount;
    weights.workLife += redistributeAmount;
    weights.environment += redistributeAmount;
    weights.financial += redistributeAmount;
  }

  // Proprietary dynamic weighting algorithm - Copyright QuickCalcLabs 2025
  // Apply non-linear transformations and correlation adjustments
  const normalizedScores = {
    productivity: _normalize(scores.productivity, 'exp'),
    meetings: _normalize(scores.meetings, 'std'),
    burnout: _normalize(scores.burnout, 'log'),
    physical: _normalize(scores.physical, 'std'),
    mental: _normalize(scores.mental, 'exp'),
    workLife: _normalize(scores.workLife, 'log'),
    environment: _normalize(scores.environment, 'std'),
    financial: _normalize(scores.financial, 'std'),
    timezone: isTimezoneWork ? _normalize(scores.timezone, 'log') : null
  };

  // Dynamic weight adjustment based on score variance
  const adjWeights = {
    productivity: _adjustWeight(scores, weights.productivity),
    meetings: _adjustWeight(scores, weights.meetings),
    burnout: _adjustWeight(scores, weights.burnout),
    physical: _adjustWeight(scores, weights.physical),
    mental: _adjustWeight(scores, weights.mental),
    workLife: _adjustWeight(scores, weights.workLife),
    environment: _adjustWeight(scores, weights.environment),
    financial: _adjustWeight(scores, weights.financial),
    timezone: isTimezoneWork ? _adjustWeight(scores, weights.timezone) : 0
  };

  // Weighted scoring with proprietary sigmoid smoothing
  let finalScore = 0;
  finalScore += normalizedScores.productivity * adjWeights.productivity;
  finalScore += normalizedScores.meetings * adjWeights.meetings;
  finalScore += normalizedScores.burnout * adjWeights.burnout;
  finalScore += normalizedScores.physical * adjWeights.physical;
  finalScore += normalizedScores.mental * adjWeights.mental;
  finalScore += normalizedScores.workLife * adjWeights.workLife;
  finalScore += normalizedScores.environment * adjWeights.environment;
  finalScore += normalizedScores.financial * adjWeights.financial;
  if (isTimezoneWork) {
    finalScore += normalizedScores.timezone * adjWeights.timezone;
  }

  // Apply sigmoid smoothing for final score calibration
  finalScore = _sigmoid(finalScore);
  finalScore = Math.round(clamp(finalScore, 0, 100));

  // Display results
  displayResults(finalScore, scores);
}

// 1. Productivity Efficiency Score
function calculateProductivityScore() {
  const hoursWorked = parseFloat(document.getElementById('hoursWorked').value) || 8;
  const deepWorkHours = parseFloat(document.getElementById('deepWorkHours').value) || 4;
  const taskCompletion = parseFloat(document.getElementById('taskCompletion').value) || 80;
  const distractionsPerDay = parseFloat(document.getElementById('distractionsPerDay').value) || 5;
  
  let score = 70; // Start lower to allow room for bonuses
  
  // Deep work bonus (max impact: +15)
  const deepWorkRatio = deepWorkHours / hoursWorked;
  if (deepWorkRatio > 0.6) {
    score += 15;
  } else if (deepWorkRatio > 0.5) {
    score += 10;
  } else if (deepWorkRatio > 0.4) {
    score += 5;
  } else if (deepWorkRatio < 0.3) {
    score -= 10;
  }
  
  // Task completion (max impact: +10)
  if (taskCompletion >= 90) {
    score += 10;
  } else if (taskCompletion >= 80) {
    score += 5;
  } else if (taskCompletion < 70) {
    score -= 10;
  } else if (taskCompletion < 80) {
    score -= 5;
  }
  
  // Distractions penalty (max impact: +10/-15)
  if (distractionsPerDay <= 2) {
    score += 10;
  } else if (distractionsPerDay <= 5) {
    score += 5;
  } else if (distractionsPerDay > 10) {
    score -= (distractionsPerDay - 10) * 1.5;
  }
  
  // Worker-specific factors
  if (currentWorkerType === 'onsite' || currentWorkerType === 'hybrid') {
    const coworkerInterruptions = parseFloat(document.getElementById('coworkerInterruptions').value) || 3;
    score -= coworkerInterruptions * 1.5;
  }
  
  if (currentWorkerType === 'remote' || currentWorkerType === 'hybrid') {
    const homeDistractions = parseFloat(document.getElementById('homeDistractions').value) || 2;
    score -= homeDistractions * 2;
  }
  
  // Timezone work reduces productivity
  if (isTimezoneWork) {
    const nightWorkDays = parseFloat(document.getElementById('nightWorkDays').value) || 0;
    score -= nightWorkDays * 2.5;
  }
  
  return clamp(score, 0, 100);
}

// 2. Workload & Meeting Balance Score
function calculateMeetingBalanceScore() {
  const meetingsPerDay = parseFloat(document.getElementById('meetingsPerDay').value) || 3;
  const avgMeetingDuration = parseFloat(document.getElementById('avgMeetingDuration').value) || 45;
  const bufferTime = parseFloat(document.getElementById('bufferTime').value) || 15;
  const meetingEnergyDrain = parseFloat(document.getElementById('meetingEnergyDrain').value) || 5;
  const asyncSyncRatio = parseFloat(document.getElementById('asyncSyncRatio').value) || 60;
  
  let score = 70; // Start lower
  
  // Meetings per day (max impact: +10/-20)
  if (meetingsPerDay <= 2) {
    score += 10;
  } else if (meetingsPerDay <= 3) {
    score += 5;
  } else if (meetingsPerDay > 5) {
    score -= (meetingsPerDay - 5) * 5;
  } else if (meetingsPerDay > 4) {
    score -= 5;
  }
  
  // Meeting duration (max impact: -15)
  if (avgMeetingDuration > 60) {
    score -= Math.min((avgMeetingDuration - 60) / 5, 15);
  }
  
  // Buffer time (max impact: +10/-10)
  if (bufferTime >= 15) {
    score += 10;
  } else if (bufferTime >= 10) {
    score += 5;
  } else if (bufferTime < 5) {
    score -= 10;
  }
  
  // Energy drain (max impact: +15/-15)
  score -= (meetingEnergyDrain - 5) * 3;
  
  // Async ratio (max impact: +10/-10)
  if (asyncSyncRatio >= 70) {
    score += 10;
  } else if (asyncSyncRatio >= 60) {
    score += 5;
  } else if (asyncSyncRatio < 40) {
    score -= 10;
  } else if (asyncSyncRatio < 50) {
    score -= 5;
  }
  
  return clamp(score, 0, 100);
}

// 3. Burnout & Stress Risk Score
function calculateBurnoutScore() {
  const weeklyHours = parseFloat(document.getElementById('weeklyHours').value) || 40;
  const feelingOverwhelmed = parseFloat(document.getElementById('feelingOverwhelmed').value) || 5;
  const sleepHours = parseFloat(document.getElementById('sleepHours').value) || 7;
  const weekendRecovery = parseFloat(document.getElementById('weekendRecovery').value) || 7;
  const emotionalExhaustion = parseFloat(document.getElementById('emotionalExhaustion').value) || 5;
  
  let score = 70; // Start lower
  
  // Weekly hours (max impact: +10/-25)
  if (weeklyHours <= 40) {
    score += 10;
  } else if (weeklyHours <= 45) {
    score += 5;
  } else if (weeklyHours > 50) {
    score -= Math.min((weeklyHours - 50) * 1.5, 25);
  } else {
    score -= (weeklyHours - 45);
  }
  
  // Feeling overwhelmed (max impact: +12/-20)
  score -= (feelingOverwhelmed - 5) * 3;
  
  // Sleep hours (critical factor, max impact: +10/-20)
  if (sleepHours >= 8) {
    score += 10;
  } else if (sleepHours >= 7) {
    score += 5;
  } else if (sleepHours < 6) {
    score -= Math.min((6 - sleepHours) * 6, 20);
  } else {
    score -= (7 - sleepHours) * 3;
  }
  
  // Weekend recovery (max impact: +12/-12)
  score += (weekendRecovery - 6) * 2;
  
  // Emotional exhaustion (max impact: +12/-15)
  score -= (emotionalExhaustion - 5) * 3;
  
  return clamp(score, 0, 100);
}

// 4. Physical Health & Ergonomics Score
function calculatePhysicalHealthScore() {
  const stepsPerDay = parseFloat(document.getElementById('stepsPerDay').value) || 6000;
  const exerciseMinutes = parseFloat(document.getElementById('exerciseMinutes').value) || 30;
  const neckBackPain = parseFloat(document.getElementById('neckBackPain').value) || 4;
  const eyeStrain = parseFloat(document.getElementById('eyeStrain').value) || 5;
  const deskSetup = parseFloat(document.getElementById('deskSetup').value) || 7;
  
  let score = 70; // Start lower
  
  // Steps (max impact: +12/-12)
  if (stepsPerDay >= 10000) {
    score += 12;
  } else if (stepsPerDay >= 7500) {
    score += 8;
  } else if (stepsPerDay >= 6000) {
    score += 4;
  } else if (stepsPerDay < 4000) {
    score -= 12;
  } else if (stepsPerDay < 5000) {
    score -= 6;
  }
  
  // Exercise (max impact: +10/-12)
  if (exerciseMinutes >= 40) {
    score += 10;
  } else if (exerciseMinutes >= 30) {
    score += 7;
  } else if (exerciseMinutes >= 20) {
    score += 3;
  } else if (exerciseMinutes < 10) {
    score -= 12;
  }
  
  // Pain penalties (max impact: +9/-15)
  score -= (neckBackPain - 5) * 2.5;
  score -= (eyeStrain - 5) * 2.5;
  
  // Desk setup (max impact: +8/-8)
  score += (deskSetup - 6) * 2;
  
  return clamp(score, 0, 100);
}

// 5. Mental Wellbeing & Social Connection Score
function calculateMentalWellbeingScore() {
  const loneliness = parseFloat(document.getElementById('loneliness').value) || 4;
  const moodScore = parseFloat(document.getElementById('moodScore').value) || 7;
  const socialInteractions = parseFloat(document.getElementById('socialInteractions').value) || 15;
  const workPressure = parseFloat(document.getElementById('workPressure').value) || 6;
  
  let score = 70; // Start lower
  
  // Loneliness (max impact: +12/-16)
  score -= (loneliness - 5) * 3;
  
  // Mood (max impact: +12/-12)
  score += (moodScore - 6) * 2.5;
  
  // Social interactions (max impact: +10/-15)
  if (socialInteractions >= 20) {
    score += 10;
  } else if (socialInteractions >= 15) {
    score += 7;
  } else if (socialInteractions >= 10) {
    score += 3;
  } else if (socialInteractions < 5) {
    score -= 15;
  } else if (socialInteractions < 8) {
    score -= 8;
  }
  
  // Work pressure (max impact: +9/-12)
  score -= (workPressure - 5) * 2.5;
  
  // Worker-specific interactions (max impact: +10/-10)
  if (currentWorkerType === 'onsite' || currentWorkerType === 'hybrid') {
    const coworkerQuality = parseFloat(document.getElementById('coworkerQuality').value) || 7;
    score += (coworkerQuality - 6) * 2.5;
  }
  
  if (currentWorkerType === 'remote') {
    const virtualSatisfaction = parseFloat(document.getElementById('virtualSatisfaction').value) || 7;
    score += (virtualSatisfaction - 6) * 2.5;
    // Remote workers get slight penalty for isolation risk
    if (loneliness > 7) {
      score -= 5;
    }
  }
  
  return clamp(score, 0, 100);
}

// 6. Work-Life Balance Score
function calculateWorkLifeBalanceScore() {
  const hoursOutsideSchedule = parseFloat(document.getElementById('hoursOutsideSchedule').value) || 5;
  const eveningWorkHours = parseFloat(document.getElementById('eveningWorkHours').value) || 3;
  const weekendWorkHours = parseFloat(document.getElementById('weekendWorkHours').value) || 2;
  const personalTimeHours = parseFloat(document.getElementById('personalTimeHours').value) || 4;
  const offScreenHours = parseFloat(document.getElementById('offScreenHours').value) || 6;
  const boundaryControl = parseFloat(document.getElementById('boundaryControl').value) || 7;
  
  let score = 70; // Start lower
  
  // Hours outside schedule (max impact: +8/-20)
  if (hoursOutsideSchedule <= 2) {
    score += 8;
  } else if (hoursOutsideSchedule <= 5) {
    score += 3;
  } else if (hoursOutsideSchedule > 10) {
    score -= Math.min((hoursOutsideSchedule - 10) * 2, 20);
  } else {
    score -= (hoursOutsideSchedule - 5) * 1.5;
  }
  
  // Evening work (max impact: -20)
  score -= Math.min(eveningWorkHours * 2, 20);
  
  // Weekend work (max impact: -20)
  score -= Math.min(weekendWorkHours * 3, 20);
  
  // Personal time (max impact: +10/-12)
  if (personalTimeHours >= 5) {
    score += 10;
  } else if (personalTimeHours >= 4) {
    score += 5;
  } else if (personalTimeHours < 2) {
    score -= 12;
  } else if (personalTimeHours < 3) {
    score -= 6;
  }
  
  // Off-screen hours (max impact: +8/-10)
  if (offScreenHours >= 7) {
    score += 8;
  } else if (offScreenHours >= 6) {
    score += 4;
  } else if (offScreenHours < 4) {
    score -= 10;
  } else if (offScreenHours < 5) {
    score -= 5;
  }
  
  // Boundary control (max impact: +10/-10)
  score += (boundaryControl - 6) * 2.5;
  
  return clamp(score, 0, 100);
}

// 7. Work Environment Quality Score
function calculateEnvironmentScore() {
  let score = 70; // Start lower
  
  if (currentWorkerType === 'remote') {
    const homeWorkspace = parseFloat(document.getElementById('homeWorkspace').value) || 7;
    const lightingScore = parseFloat(document.getElementById('lightingScore').value) || 8;
    const noiseLevel = parseFloat(document.getElementById('noiseLevel').value) || 4;
    const tempComfort = parseFloat(document.getElementById('tempComfort').value) || 7;
    const internetStability = parseFloat(document.getElementById('internetStability').value) || 9;
    
    score += (homeWorkspace - 6) * 2.5;
    score += (lightingScore - 6) * 2;
    score -= (noiseLevel - 5) * 2.5;
    score += (tempComfort - 6) * 2;
    score += (internetStability - 6) * 2.5;
    
  } else if (currentWorkerType === 'onsite') {
    const officeNoise = parseFloat(document.getElementById('officeNoise').value) || 5;
    const workspaceComfort = parseFloat(document.getElementById('workspaceComfort').value) || 7;
    const privacyRating = parseFloat(document.getElementById('privacyRating').value) || 6;
    const commuteEnvironment = parseFloat(document.getElementById('commuteEnvironment').value) || 6;
    
    score -= (officeNoise - 5) * 2.5;
    score += (workspaceComfort - 6) * 2.5;
    score += (privacyRating - 6) * 2.5;
    score += (commuteEnvironment - 6) * 2;
    
  } else if (currentWorkerType === 'hybrid') {
    const homeWorkspaceHybrid = parseFloat(document.getElementById('homeWorkspaceHybrid').value) || 7;
    const officeComfortHybrid = parseFloat(document.getElementById('officeComfortHybrid').value) || 7;
    
    // Average both environments
    const avgEnvironment = (homeWorkspaceHybrid + officeComfortHybrid) / 2;
    score += (avgEnvironment - 6) * 3.5;
  }
  
  return clamp(score, 0, 100);
}

// 8. Financial & Commute Stress Score
function calculateFinancialStressScore() {
  let score = 70; // Start lower
  
  if (currentWorkerType === 'remote') {
    const incomeStability = parseFloat(document.getElementById('incomeStability').value) || 8;
    const financialStress = parseFloat(document.getElementById('financialStress').value) || 5;
    const jobSecurity = parseFloat(document.getElementById('jobSecurity').value) || 7;
    
    score += (incomeStability - 6) * 2.5;
    score -= (financialStress - 5) * 3;
    score += (jobSecurity - 6) * 2.5;
    
  } else {
    // Onsite or Hybrid
    const commuteTime = parseFloat(document.getElementById('commuteTime').value) || 30;
    const commuteCost = parseFloat(document.getElementById('commuteCost').value) || 150;
    const trafficStress = parseFloat(document.getElementById('trafficStress').value) || 6;
    const transportReliability = parseFloat(document.getElementById('transportReliability').value) || 7;
    
    // Commute time (max impact: +8/-15)
    if (commuteTime <= 15) {
      score += 8;
    } else if (commuteTime <= 25) {
      score += 4;
    } else if (commuteTime > 60) {
      score -= Math.min((commuteTime - 60) / 3, 15);
    } else if (commuteTime > 45) {
      score -= (commuteTime - 45) / 4;
    }
    
    // Commute cost (max impact: +8/-15)
    if (commuteCost <= 75) {
      score += 8;
    } else if (commuteCost <= 125) {
      score += 4;
    } else if (commuteCost > 300) {
      score -= Math.min((commuteCost - 300) / 15, 15);
    } else if (commuteCost > 200) {
      score -= (commuteCost - 200) / 25;
    }
    
    // Traffic stress (max impact: +9/-12)
    score -= (trafficStress - 5) * 2.5;
    
    // Transport reliability (max impact: +8/-8)
    score += (transportReliability - 6) * 2;
  }
  
  return clamp(score, 0, 100);
}

// 9. Time-Zone Alignment Stress Score
function calculateTimezoneStressScore() {
  const timezoneGap = parseFloat(document.getElementById('timezoneGap').value) || 3;
  const requiredOverlap = parseFloat(document.getElementById('requiredOverlap').value) || 4;
  const workingHoursStart = parseFloat(document.getElementById('workingHoursStart').value) || 9;
  const workingHoursEnd = parseFloat(document.getElementById('workingHoursEnd').value) || 17;
  const nightWorkDays = parseFloat(document.getElementById('nightWorkDays').value) || 0;
  const sleepDisruption = parseFloat(document.getElementById('sleepDisruption').value) || 5;
  const familyTimeLoss = parseFloat(document.getElementById('familyTimeLoss').value) || 5;
  const weekendOnCall = document.getElementById('weekendOnCall').value === 'yes';
  const scheduleFlexibility = parseFloat(document.getElementById('scheduleFlexibility').value) || 5;
  
  let score = 70; // Start lower
  
  // Timezone gap (max impact: -25)
  score -= Math.min(timezoneGap * 2.5, 25);
  
  // Required overlap (max impact: -15)
  if (requiredOverlap > 6) {
    score -= Math.min((requiredOverlap - 6) * 2.5, 15);
  } else if (requiredOverlap > 4) {
    score -= (requiredOverlap - 4) * 1.5;
  }
  
  // Working night hours penalty (working between 12 AM - 6 AM)
  const isWorkingLateNight = (workingHoursStart >= 0 && workingHoursStart < 6) || 
                              (workingHoursEnd >= 0 && workingHoursEnd < 6) ||
                              (workingHoursStart > workingHoursEnd); // overnight shift
  
  if (isWorkingLateNight) {
    score -= 15;
  }
  
  // Night work days (max impact: -20)
  score -= Math.min(nightWorkDays * 4, 20);
  
  // Sleep disruption (max impact: +12/-15)
  score -= (sleepDisruption - 5) * 3;
  
  // Family time loss (max impact: +9/-12)
  score -= (familyTimeLoss - 5) * 2.5;
  
  // Weekend on-call (max impact: -12)
  if (weekendOnCall) {
    score -= 12;
  }
  
  // Schedule flexibility (max impact: +12/-12)
  score += (scheduleFlexibility - 5) * 2.5;
  
  return clamp(score, 0, 100);
}

// Proprietary scoring utilities - Copyright QuickCalcLabs 2025
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Advanced normalization with proprietary weighting curves
function _normalize(raw, type) {
  const curve = type === 'exp' ? 1.15 : type === 'log' ? 0.87 : 1.0;
  const adj = _0x9e1b(raw, curve);
  return clamp(adj * _0x7f3d.c - (100 - adj) * _0x7f3d.d * 0.1, 0, 100);
}

// Proprietary dynamic weight adjuster based on correlation patterns
function _adjustWeight(scores, baseWeight) {
  const variance = Object.values(scores).reduce((sum, s) => sum + Math.pow(s - 70, 2), 0) / 9;
  const factor = 1 + (variance / 1000) * _0x7f3d.e * 0.1;
  return baseWeight * Math.min(factor, 1.3);
}

// Hidden sigmoid transformation for score smoothing
function _sigmoid(x, steepness = 0.05) {
  return 100 / (1 + Math.exp(-steepness * (x - 70)));
}

// Display results
function displayResults(finalScore, scores) {
  // Store for sharing
  finalWLQIScore = finalScore;
  
  // Update score display
  document.getElementById('wlqiScore').textContent = finalScore;
  
  // Determine rating
  let rating = '';
  let ratingClass = '';
  
  if (finalScore >= 90) {
    rating = '🌟 Thriving';
    ratingClass = 'thriving';
    finalRatingText = 'Thriving';
  } else if (finalScore >= 75) {
    rating = '✅ Healthy';
    ratingClass = 'healthy';
    finalRatingText = 'Healthy';
  } else if (finalScore >= 60) {
    rating = '⚖️ Stable';
    ratingClass = 'stable';
    finalRatingText = 'Stable';
  } else if (finalScore >= 40) {
    rating = '⚠️ Struggling';
    ratingClass = 'struggling';
    finalRatingText = 'Struggling';
  } else {
    rating = '🚨 Critical';
    ratingClass = 'critical';
    finalRatingText = 'Critical';
  }
  
  const ratingElement = document.getElementById('wlqiRating');
  ratingElement.textContent = rating;
  ratingElement.className = 'wlqi-rating ' + ratingClass;
  
  // Display dimension breakdown
  displayBreakdown(scores);
  
  // Render radar chart
  renderRadarChart(scores);
  
  // Generate recommendations
  generateRecommendations(scores);
  
  // Show results
  const resultsBox = document.getElementById('results');
  resultsBox.classList.add('show');
  
  // Scroll to results
  setTimeout(() => {
    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Display dimension breakdown
function displayBreakdown(scores) {
  const grid = document.getElementById('breakdownGrid');
  grid.innerHTML = '';
  
  const dimensions = [
    { name: 'Productivity Efficiency', score: scores.productivity },
    { name: 'Meeting Balance', score: scores.meetings },
    { name: 'Burnout Risk', score: scores.burnout },
    { name: 'Physical Health', score: scores.physical },
    { name: 'Mental Wellbeing', score: scores.mental },
    { name: 'Work-Life Balance', score: scores.workLife },
    { name: 'Environment Quality', score: scores.environment },
    { name: 'Financial/Commute', score: scores.financial }
  ];
  
  if (isTimezoneWork && scores.timezone !== null) {
    dimensions.push({ name: 'Timezone Stress', score: scores.timezone });
  }
  
  dimensions.forEach(dim => {
    const card = document.createElement('div');
    card.className = 'breakdown-card';
    card.innerHTML = `
      <h4>${dim.name}</h4>
      <div class="breakdown-score">${Math.round(dim.score)}</div>
    `;
    grid.appendChild(card);
  });
}

// Render radar chart
function renderRadarChart(scores) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  
  const labels = [
    'Productivity',
    'Meetings',
    'Burnout Risk',
    'Physical Health',
    'Mental Wellbeing',
    'Work-Life Balance',
    'Environment',
    'Financial/Commute'
  ];
  
  const data = [
    scores.productivity,
    scores.meetings,
    scores.burnout,
    scores.physical,
    scores.mental,
    scores.workLife,
    scores.environment,
    scores.financial
  ];
  
  if (isTimezoneWork && scores.timezone !== null) {
    labels.push('Timezone');
    data.push(scores.timezone);
  }
  
  // Destroy existing chart if it exists
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }
  
  // Determine if dark mode is active
  const isDarkMode = document.body.classList.contains('dark-mode');
  const textColor = isDarkMode ? '#f1f5f9' : '#0f172a';
  const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.5)';
  
  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Your WLQI Dimensions',
        data: data,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgb(139, 92, 246)',
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          min: 0,
          ticks: {
            stepSize: 20,
            color: textColor,
            backdropColor: 'transparent'
          },
          grid: {
            color: gridColor
          },
          pointLabels: {
            color: textColor,
            font: {
              size: 12,
              weight: '600'
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + Math.round(context.parsed.r) + '/100';
            }
          }
        }
      }
    }
  });
}

// Generate personalized recommendations
function generateRecommendations(scores) {
  const container = document.getElementById('recommendations');
  
  // Find two weakest dimensions
  const dimensions = [
    { name: 'Productivity Efficiency', score: scores.productivity, key: 'productivity' },
    { name: 'Workload & Meeting Balance', score: scores.meetings, key: 'meetings' },
    { name: 'Burnout & Stress Risk', score: scores.burnout, key: 'burnout' },
    { name: 'Physical Health & Ergonomics', score: scores.physical, key: 'physical' },
    { name: 'Mental Wellbeing & Social Connection', score: scores.mental, key: 'mental' },
    { name: 'Work-Life Balance', score: scores.workLife, key: 'workLife' },
    { name: 'Work Environment Quality', score: scores.environment, key: 'environment' },
    { name: 'Financial & Commute Stress', score: scores.financial, key: 'financial' }
  ];
  
  if (isTimezoneWork && scores.timezone !== null) {
    dimensions.push({ name: 'Time-Zone Alignment Stress', score: scores.timezone, key: 'timezone' });
  }
  
  // Sort by score (lowest first)
  dimensions.sort((a, b) => a.score - b.score);
  
  const weakest = dimensions.slice(0, 2);
  
  let html = '<h3>📋 Personalized Recommendations</h3>';
  html += '<p style="color: var(--text-weak-light); margin-bottom: 2rem;">Focus on improving these two areas for maximum impact on your work-life quality:</p>';
  
  weakest.forEach(dim => {
    html += `<div class="recommendation-section">`;
    html += `<h4>${dim.name} (Score: ${Math.round(dim.score)}/100)</h4>`;
    html += `<ul>${getRecommendationsForDimension(dim.key)}</ul>`;
    html += `</div>`;
  });
  
  container.innerHTML = html;
}

// Get specific recommendations for each dimension
function getRecommendationsForDimension(key) {
  const recommendations = {
    productivity: `
      <li>Block dedicated "deep work" time in your calendar (2-4 hour blocks) and protect it from meetings</li>
      <li>Use the Pomodoro technique: 25 minutes of focused work followed by 5-minute breaks</li>
      <li>Minimize distractions: turn off notifications, use website blockers, communicate "focus time" to colleagues</li>
    `,
    meetings: `
      <li>Audit your recurring meetings—decline or delegate those where you're not essential</li>
      <li>Implement "meeting-free" blocks or days for focused work</li>
      <li>Suggest 25 or 50-minute meetings instead of 30 or 60 to build in natural buffer time</li>
    `,
    burnout: `
      <li>Set firm work boundaries: define start/end times and stick to them</li>
      <li>Prioritize 7-9 hours of sleep nightly—it's essential for stress recovery</li>
      <li>Take all your vacation days and truly disconnect during time off</li>
    `,
    physical: `
      <li>Invest in ergonomic equipment: adjustable chair, monitor stand, keyboard, and mouse</li>
      <li>Set hourly reminders to stand up, stretch, or walk for 2-5 minutes</li>
      <li>Schedule exercise like an important meeting—aim for 150 minutes of moderate activity weekly</li>
    `,
    mental: `
      <li>Schedule regular social interactions—virtual coffee chats with colleagues or friends</li>
      <li>Practice stress management techniques: meditation, journaling, therapy, or mindfulness apps</li>
      <li>Build informal connections with team members beyond work discussions</li>
    `,
    workLife: `
      <li>Disable work notifications outside business hours</li>
      <li>Create end-of-day rituals to transition from work mode to personal time</li>
      <li>Schedule personal activities and treat them as non-negotiable appointments</li>
    `,
    environment: `
      <li>Optimize lighting to reduce eye strain—natural light is best, or use full-spectrum bulbs</li>
      <li>Address noise issues with noise-canceling headphones, white noise, or dedicated quiet space</li>
      <li>Ensure proper temperature control—too hot or cold affects concentration and comfort</li>
    `,
    financial: `
      <li>If commuting is stressful, discuss remote or hybrid options with your employer</li>
      <li>Explore alternative transportation options that may be faster, cheaper, or less stressful</li>
      <li>Consider relocating closer to work if commute time/cost is severely impacting quality of life</li>
    `,
    timezone: `
      <li>Negotiate schedule flexibility to reduce late-night or early-morning work requirements</li>
      <li>Maximize asynchronous work to reduce synchronous meeting overlap needs</li>
      <li>Protect your sleep schedule—never consistently sacrifice sleep for work demands</li>
    `
  };
  
  return recommendations[key] || '<li>Focus on this area for improvement</li>';
}

