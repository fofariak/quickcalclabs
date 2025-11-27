// Work-Life Quality Index Calculator
// Comprehensive scoring system for Remote, Hybrid, and Onsite workers

let currentWorkerType = 'remote';
let isTimezoneWork = false;
let radarChartInstance = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode();
  initializeWorkerTypeSelection();
  initializeTimezoneToggle();
  initializeRangeDisplays();
  initializeFormSubmit();
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

  // Calculate weighted final score
  let finalScore = 0;
  finalScore += scores.productivity * weights.productivity;
  finalScore += scores.meetings * weights.meetings;
  finalScore += scores.burnout * weights.burnout;
  finalScore += scores.physical * weights.physical;
  finalScore += scores.mental * weights.mental;
  finalScore += scores.workLife * weights.workLife;
  finalScore += scores.environment * weights.environment;
  finalScore += scores.financial * weights.financial;
  if (isTimezoneWork) {
    finalScore += scores.timezone * weights.timezone;
  }

  finalScore = Math.round(finalScore);

  // Display results
  displayResults(finalScore, scores);
}

// 1. Productivity Efficiency Score
function calculateProductivityScore() {
  const hoursWorked = parseFloat(document.getElementById('hoursWorked').value) || 8;
  const deepWorkHours = parseFloat(document.getElementById('deepWorkHours').value) || 4;
  const taskCompletion = parseFloat(document.getElementById('taskCompletion').value) || 80;
  const distractionsPerDay = parseFloat(document.getElementById('distractionsPerDay').value) || 5;
  
  let score = 100;
  
  // Deep work bonus
  const deepWorkRatio = deepWorkHours / hoursWorked;
  if (deepWorkRatio > 0.5) {
    score += 10;
  } else if (deepWorkRatio < 0.3) {
    score -= 15;
  }
  
  // Task completion
  score += (taskCompletion - 80) * 0.5; // +0.5 for each % above 80, -0.5 for below
  
  // Distractions penalty
  if (distractionsPerDay > 10) {
    score -= (distractionsPerDay - 10) * 2;
  } else if (distractionsPerDay < 3) {
    score += 10;
  }
  
  // Worker-specific factors
  if (currentWorkerType === 'onsite' || currentWorkerType === 'hybrid') {
    const coworkerInterruptions = parseFloat(document.getElementById('coworkerInterruptions').value) || 3;
    score -= coworkerInterruptions * 2;
  }
  
  if (currentWorkerType === 'remote' || currentWorkerType === 'hybrid') {
    const homeDistractions = parseFloat(document.getElementById('homeDistractions').value) || 2;
    score -= homeDistractions * 2.5;
  }
  
  // Timezone work reduces productivity
  if (isTimezoneWork) {
    const nightWorkDays = parseFloat(document.getElementById('nightWorkDays').value) || 0;
    score -= nightWorkDays * 3;
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
  
  let score = 100;
  
  // Meetings per day
  if (meetingsPerDay > 4) {
    score -= (meetingsPerDay - 4) * 8;
  } else if (meetingsPerDay < 2) {
    score += 10;
  }
  
  // Meeting duration
  if (avgMeetingDuration > 60) {
    score -= (avgMeetingDuration - 60) / 5;
  }
  
  // Buffer time
  if (bufferTime < 10) {
    score -= 15;
  } else if (bufferTime >= 15) {
    score += 10;
  }
  
  // Energy drain
  score -= (meetingEnergyDrain - 5) * 3;
  
  // Async ratio bonus
  if (asyncSyncRatio > 70) {
    score += 15;
  } else if (asyncSyncRatio < 40) {
    score -= 10;
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
  
  let score = 100;
  
  // Weekly hours penalty
  if (weeklyHours > 50) {
    score -= (weeklyHours - 50) * 2;
  } else if (weeklyHours > 45) {
    score -= (weeklyHours - 45);
  } else if (weeklyHours <= 40) {
    score += 10;
  }
  
  // Feeling overwhelmed
  score -= (feelingOverwhelmed - 5) * 4;
  
  // Sleep hours (critical factor)
  if (sleepHours < 6) {
    score -= (6 - sleepHours) * 8;
  } else if (sleepHours < 7) {
    score -= (7 - sleepHours) * 4;
  } else if (sleepHours >= 8) {
    score += 10;
  }
  
  // Weekend recovery bonus
  score += (weekendRecovery - 5) * 3;
  
  // Emotional exhaustion
  score -= (emotionalExhaustion - 5) * 4;
  
  return clamp(score, 0, 100);
}

// 4. Physical Health & Ergonomics Score
function calculatePhysicalHealthScore() {
  const stepsPerDay = parseFloat(document.getElementById('stepsPerDay').value) || 6000;
  const exerciseMinutes = parseFloat(document.getElementById('exerciseMinutes').value) || 30;
  const neckBackPain = parseFloat(document.getElementById('neckBackPain').value) || 4;
  const eyeStrain = parseFloat(document.getElementById('eyeStrain').value) || 5;
  const deskSetup = parseFloat(document.getElementById('deskSetup').value) || 7;
  
  let score = 100;
  
  // Steps bonus
  if (stepsPerDay >= 10000) {
    score += 15;
  } else if (stepsPerDay >= 6000) {
    score += 5;
  } else if (stepsPerDay < 4000) {
    score -= 15;
  }
  
  // Exercise bonus
  if (exerciseMinutes >= 30) {
    score += 10;
  } else if (exerciseMinutes >= 20) {
    score += 5;
  } else if (exerciseMinutes < 10) {
    score -= 15;
  }
  
  // Pain penalties
  score -= (neckBackPain - 5) * 3;
  score -= (eyeStrain - 5) * 3;
  
  // Desk setup bonus
  score += (deskSetup - 5) * 2;
  
  return clamp(score, 0, 100);
}

// 5. Mental Wellbeing & Social Connection Score
function calculateMentalWellbeingScore() {
  const loneliness = parseFloat(document.getElementById('loneliness').value) || 4;
  const moodScore = parseFloat(document.getElementById('moodScore').value) || 7;
  const socialInteractions = parseFloat(document.getElementById('socialInteractions').value) || 15;
  const workPressure = parseFloat(document.getElementById('workPressure').value) || 6;
  
  let score = 100;
  
  // Loneliness penalty
  score -= (loneliness - 5) * 4;
  
  // Mood bonus
  score += (moodScore - 5) * 3;
  
  // Social interactions
  if (socialInteractions >= 20) {
    score += 10;
  } else if (socialInteractions >= 10) {
    score += 5;
  } else if (socialInteractions < 5) {
    score -= 20;
  }
  
  // Work pressure
  score -= (workPressure - 5) * 3;
  
  // Worker-specific interactions
  if (currentWorkerType === 'onsite' || currentWorkerType === 'hybrid') {
    const coworkerQuality = parseFloat(document.getElementById('coworkerQuality').value) || 7;
    score += (coworkerQuality - 5) * 3;
  }
  
  if (currentWorkerType === 'remote') {
    const virtualSatisfaction = parseFloat(document.getElementById('virtualSatisfaction').value) || 7;
    score += (virtualSatisfaction - 5) * 3;
    // Remote workers get slight penalty for isolation risk
    if (loneliness > 6) {
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
  
  let score = 100;
  
  // Hours outside schedule penalty
  if (hoursOutsideSchedule > 10) {
    score -= (hoursOutsideSchedule - 10) * 3;
  } else if (hoursOutsideSchedule > 5) {
    score -= (hoursOutsideSchedule - 5) * 2;
  } else if (hoursOutsideSchedule <= 2) {
    score += 10;
  }
  
  // Evening work penalty
  score -= eveningWorkHours * 2.5;
  
  // Weekend work penalty
  score -= weekendWorkHours * 4;
  
  // Personal time bonus
  if (personalTimeHours >= 4) {
    score += 10;
  } else if (personalTimeHours < 2) {
    score -= 15;
  }
  
  // Off-screen hours bonus
  if (offScreenHours >= 6) {
    score += 10;
  } else if (offScreenHours < 4) {
    score -= 10;
  }
  
  // Boundary control
  score += (boundaryControl - 5) * 3;
  
  return clamp(score, 0, 100);
}

// 7. Work Environment Quality Score
function calculateEnvironmentScore() {
  let score = 100;
  
  if (currentWorkerType === 'remote') {
    const homeWorkspace = parseFloat(document.getElementById('homeWorkspace').value) || 7;
    const lightingScore = parseFloat(document.getElementById('lightingScore').value) || 8;
    const noiseLevel = parseFloat(document.getElementById('noiseLevel').value) || 4;
    const tempComfort = parseFloat(document.getElementById('tempComfort').value) || 7;
    const internetStability = parseFloat(document.getElementById('internetStability').value) || 9;
    
    score += (homeWorkspace - 5) * 3;
    score += (lightingScore - 5) * 2;
    score -= (noiseLevel - 5) * 3;
    score += (tempComfort - 5) * 2;
    score += (internetStability - 5) * 3;
    
  } else if (currentWorkerType === 'onsite') {
    const officeNoise = parseFloat(document.getElementById('officeNoise').value) || 5;
    const workspaceComfort = parseFloat(document.getElementById('workspaceComfort').value) || 7;
    const privacyRating = parseFloat(document.getElementById('privacyRating').value) || 6;
    const commuteEnvironment = parseFloat(document.getElementById('commuteEnvironment').value) || 6;
    
    score -= (officeNoise - 5) * 3;
    score += (workspaceComfort - 5) * 3;
    score += (privacyRating - 5) * 3;
    score += (commuteEnvironment - 5) * 2;
    
  } else if (currentWorkerType === 'hybrid') {
    const homeWorkspaceHybrid = parseFloat(document.getElementById('homeWorkspaceHybrid').value) || 7;
    const officeComfortHybrid = parseFloat(document.getElementById('officeComfortHybrid').value) || 7;
    
    // Average both environments
    const avgEnvironment = (homeWorkspaceHybrid + officeComfortHybrid) / 2;
    score += (avgEnvironment - 5) * 4;
  }
  
  return clamp(score, 0, 100);
}

// 8. Financial & Commute Stress Score
function calculateFinancialStressScore() {
  let score = 100;
  
  if (currentWorkerType === 'remote') {
    const incomeStability = parseFloat(document.getElementById('incomeStability').value) || 8;
    const financialStress = parseFloat(document.getElementById('financialStress').value) || 5;
    const jobSecurity = parseFloat(document.getElementById('jobSecurity').value) || 7;
    
    score += (incomeStability - 5) * 3;
    score -= (financialStress - 5) * 4;
    score += (jobSecurity - 5) * 3;
    
  } else {
    // Onsite or Hybrid
    const commuteTime = parseFloat(document.getElementById('commuteTime').value) || 30;
    const commuteCost = parseFloat(document.getElementById('commuteCost').value) || 150;
    const trafficStress = parseFloat(document.getElementById('trafficStress').value) || 6;
    const transportReliability = parseFloat(document.getElementById('transportReliability').value) || 7;
    
    // Commute time penalty
    if (commuteTime > 60) {
      score -= (commuteTime - 60) / 2;
    } else if (commuteTime > 45) {
      score -= (commuteTime - 45) / 3;
    } else if (commuteTime <= 20) {
      score += 10;
    }
    
    // Commute cost penalty
    if (commuteCost > 300) {
      score -= (commuteCost - 300) / 10;
    } else if (commuteCost > 200) {
      score -= (commuteCost - 200) / 20;
    } else if (commuteCost < 100) {
      score += 10;
    }
    
    // Traffic stress
    score -= (trafficStress - 5) * 3;
    
    // Transport reliability
    score += (transportReliability - 5) * 2;
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
  
  let score = 100;
  
  // Timezone gap penalty
  score -= timezoneGap * 3;
  
  // Required overlap penalty
  if (requiredOverlap > 6) {
    score -= (requiredOverlap - 6) * 3;
  } else if (requiredOverlap > 4) {
    score -= (requiredOverlap - 4) * 2;
  }
  
  // Working night hours penalty (working between 12 AM - 6 AM)
  const isWorkingLateNight = (workingHoursStart >= 0 && workingHoursStart < 6) || 
                              (workingHoursEnd >= 0 && workingHoursEnd < 6) ||
                              (workingHoursStart > workingHoursEnd); // overnight shift
  
  if (isWorkingLateNight) {
    score -= 20;
  }
  
  // Night work days penalty
  score -= nightWorkDays * 5;
  
  // Sleep disruption
  score -= (sleepDisruption - 5) * 4;
  
  // Family time loss
  score -= (familyTimeLoss - 5) * 3;
  
  // Weekend on-call
  if (weekendOnCall) {
    score -= 15;
  }
  
  // Schedule flexibility bonus
  score += (scheduleFlexibility - 5) * 3;
  
  return clamp(score, 0, 100);
}

// Utility function to clamp values
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Display results
function displayResults(finalScore, scores) {
  // Update score display
  document.getElementById('wlqiScore').textContent = finalScore;
  
  // Determine rating
  let rating = '';
  let ratingClass = '';
  
  if (finalScore >= 90) {
    rating = '🌟 Thriving';
    ratingClass = 'thriving';
  } else if (finalScore >= 75) {
    rating = '✅ Healthy';
    ratingClass = 'healthy';
  } else if (finalScore >= 60) {
    rating = '⚖️ Stable';
    ratingClass = 'stable';
  } else if (finalScore >= 40) {
    rating = '⚠️ Struggling';
    ratingClass = 'struggling';
  } else {
    rating = '🚨 Critical';
    ratingClass = 'critical';
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

