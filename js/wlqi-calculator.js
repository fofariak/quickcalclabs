// Work-Life Quality Index Calculator
// Copyright (c) 2025 QuickCalcLabs. All Rights Reserved.
// Proprietary and Confidential - Unauthorized copying, distribution, or use is strictly prohibited.
// This software contains trade secrets and proprietary algorithms protected by copyright law.

let currentWorkerType = 'remote';
let isTimezoneWork = false;
let radarChartInstance = null;
let isTeamMode = false; // New: Track if we're in team assessment mode
let lastRadarScores = null;
let radarResizeTimeout = null;

// Proprietary normalization constants (obfuscated)
const _0x4a2c = [0x2e, 0x3c, 0x4b, 0x5a, 0x69, 0x78, 0x87, 0x96, 0xa5];
const _0x7f3d = { a: 1.247, b: 0.893, c: 1.156, d: 0.734, e: 1.421 };
const _0x9e1b = (v, m) => Math.pow(v / 100, m) * 100;
const _0x3c8f = (s, w) => s * w * _0x7f3d.a + (100 - s) * (1 - w) * _0x7f3d.b;

// Store final score for sharing
let finalWLQIScore = 0;
let finalRatingText = '';
let teamName = '';
let teamSize = 0;

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
  initializeModeToggle(); // New: Mode toggle (Individual vs Team)
  initializeWorkerTypeSelection();
  initializeTimezoneToggle();
  initializeRangeDisplays();
  initializeFormSubmit();
  initializeQuickFill();
  initializeSocialSharing();
  initializeCollapsibleSections();
  updateConditionalInputs();
  window.addEventListener('resize', scheduleRadarResize);
});

// Mode toggle functionality (Individual vs Team)
function initializeModeToggle() {
  const individualBtn = document.getElementById('modeIndividual');
  const teamBtn = document.getElementById('modeTeam');
  const teamSizeSection = document.getElementById('teamSizeSection');
  const teamSurveySection = document.getElementById('teamSurveySection');
  const workerTypeLabel = document.getElementById('workerTypeLabel');
  const timezoneLabel = document.getElementById('timezoneLabel');
  const quickFillText = document.getElementById('quickFillText');

  if (!individualBtn || !teamBtn) return;

  individualBtn.addEventListener('click', () => {
    isTeamMode = false;
    individualBtn.classList.add('active');
    teamBtn.classList.remove('active');
    teamSizeSection.classList.remove('show');
    if (teamSurveySection) teamSurveySection.classList.remove('show');
    
    // Update labels for individual mode
    if (workerTypeLabel) workerTypeLabel.textContent = 'Your';
    if (timezoneLabel) timezoneLabel.textContent = 'I work';
    if (quickFillText) quickFillText.textContent = 'Want to save time? Use typical values for a quick assessment';
  });

  teamBtn.addEventListener('click', () => {
    isTeamMode = true;
    teamBtn.classList.add('active');
    individualBtn.classList.remove('active');
    teamSizeSection.classList.add('show');
    if (teamSurveySection) teamSurveySection.classList.add('show');
    
    // Update labels for team mode
    if (workerTypeLabel) workerTypeLabel.textContent = 'Your Team\'s Primary';
    if (timezoneLabel) timezoneLabel.textContent = 'Team members work';
    if (quickFillText) quickFillText.textContent = 'Fill with typical team average values for quick assessment';
  });

  // Initialize team survey functionality
  initializeTeamSurvey();
}

// Team Survey Sharing functionality
function initializeTeamSurvey() {
  const copyLinkBtn = document.getElementById('copyTeamLinkBtn');
  const toggleCollectorBtn = document.getElementById('toggleCollectorBtn');
  const teamCollector = document.getElementById('teamCollector');
  const addScoreBtn = document.getElementById('addScoreBtn');

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', copyTeamSurveyLink);
  }

  if (toggleCollectorBtn && teamCollector) {
    toggleCollectorBtn.addEventListener('click', () => {
      teamCollector.classList.toggle('show');
      toggleCollectorBtn.textContent = teamCollector.classList.contains('show') 
        ? '📊 Hide Score Collector' 
        : '📊 Collect Team Scores';
    });
  }

  if (addScoreBtn) {
    addScoreBtn.addEventListener('click', addScoreRow);
  }

  // Add input listeners to calculate average on change
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('member-score')) {
      calculateTeamAverage();
    }
  });
}

// Copy team survey link
function copyTeamSurveyLink() {
  const surveyUrl = window.location.origin + '/work-life-quality-index.html';
  const teamName = document.getElementById('teamName').value || 'Your Team';
  
  const shareText = `Hi team! 👋

Please take 5-10 minutes to complete our Work-Life Quality Index assessment. This anonymous survey helps us understand how we can better support your wellbeing.

📊 Survey Link: ${surveyUrl}

After completing the assessment, please share your final WLQI score (the number out of 100) with me.

Thanks!`;

  navigator.clipboard.writeText(shareText).then(() => {
    const btn = document.getElementById('copyTeamLinkBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Copied to Clipboard!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2500);
  }).catch(err => {
    // Fallback: show alert with text
    alert('Copy this message to share with your team:\n\n' + shareText);
  });
}

// Add new score input row
function addScoreRow() {
  const container = document.getElementById('scoreInputs');
  const newRow = document.createElement('div');
  newRow.className = 'score-input-row';
  newRow.innerHTML = `
    <input type="text" placeholder="Team member name (optional)" class="member-name">
    <input type="number" min="0" max="100" placeholder="Score (0-100)" class="member-score">
    <button type="button" class="remove-score-btn" onclick="removeScoreRow(this)">×</button>
  `;
  container.appendChild(newRow);
}

// Remove score input row
function removeScoreRow(btn) {
  const row = btn.parentElement;
  const container = document.getElementById('scoreInputs');
  
  // Keep at least 2 rows
  if (container.children.length > 2) {
    row.remove();
    calculateTeamAverage();
  } else {
    // Just clear the inputs
    row.querySelector('.member-name').value = '';
    row.querySelector('.member-score').value = '';
    calculateTeamAverage();
  }
}

// Calculate team average from collected scores
function calculateTeamAverage() {
  const scoreInputs = document.querySelectorAll('.member-score');
  const resultDiv = document.getElementById('teamAvgResult');
  const avgScoreEl = document.getElementById('teamAvgScore');
  const countEl = document.getElementById('validScoreCount');
  
  let total = 0;
  let count = 0;
  
  scoreInputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      total += value;
      count++;
    }
  });
  
  if (count >= 2) {
    const average = Math.round(total / count);
    avgScoreEl.textContent = average;
    countEl.textContent = count;
    resultDiv.style.display = 'block';
    
    // Update team size input
    document.getElementById('teamSize').value = count;
    
    // Color based on score
    if (average >= 75) {
      avgScoreEl.style.color = '#10b981';
    } else if (average >= 60) {
      avgScoreEl.style.color = '#fbbf24';
    } else if (average >= 40) {
      avgScoreEl.style.color = '#f97316';
    } else {
      avgScoreEl.style.color = '#ef4444';
    }
  } else {
    resultDiv.style.display = 'none';
  }
}

// Use the collected team average to directly show team results
function useAverageForCalculation() {
  const avgScore = parseInt(document.getElementById('teamAvgScore').textContent);
  const validCount = parseInt(document.getElementById('validScoreCount').textContent);
  
  // Get team info
  teamName = document.getElementById('teamName').value || 'Your Team';
  teamSize = validCount;
  
  // Generate estimated dimension scores based on the team average
  // This creates a realistic distribution around the average
  const baseScore = avgScore;
  const variance = 8; // How much dimensions can vary from average
  
  const estimatedScores = {
    productivity: clamp(baseScore + randomVariance(variance), 0, 100),
    meetings: clamp(baseScore + randomVariance(variance), 0, 100),
    burnout: clamp(baseScore + randomVariance(variance * 1.2), 0, 100), // Burnout often varies more
    physical: clamp(baseScore + randomVariance(variance), 0, 100),
    mental: clamp(baseScore + randomVariance(variance), 0, 100),
    workLife: clamp(baseScore + randomVariance(variance), 0, 100),
    environment: clamp(baseScore + randomVariance(variance * 0.8), 0, 100),
    financial: clamp(baseScore + randomVariance(variance * 0.8), 0, 100),
    timezone: isTimezoneWork ? clamp(baseScore + randomVariance(variance), 0, 100) : null
  };
  
  // Display results using the actual team average as the final score
  displayTeamResults(avgScore, estimatedScores, validCount);
}

// Helper function to generate random variance
function randomVariance(maxVariance) {
  return Math.round((Math.random() - 0.5) * 2 * maxVariance);
}

// Display results specifically for collected team scores
function displayTeamResults(teamAvgScore, scores, memberCount) {
  // Store for sharing
  finalWLQIScore = teamAvgScore;
  lastRadarScores = scores;
  
  // Update score display
  document.getElementById('wlqiScore').textContent = teamAvgScore;
  
  // Determine rating
  let rating = '';
  let ratingClass = '';
  
  if (teamAvgScore >= 90) {
    rating = '🌟 Team Thriving';
    ratingClass = 'thriving';
    finalRatingText = 'Thriving';
  } else if (teamAvgScore >= 75) {
    rating = '✅ Team Healthy';
    ratingClass = 'healthy';
    finalRatingText = 'Healthy';
  } else if (teamAvgScore >= 60) {
    rating = '⚖️ Team Stable';
    ratingClass = 'stable';
    finalRatingText = 'Stable';
  } else if (teamAvgScore >= 40) {
    rating = '⚠️ Team Struggling';
    ratingClass = 'struggling';
    finalRatingText = 'Struggling';
  } else {
    rating = '🚨 Team Critical';
    ratingClass = 'critical';
    finalRatingText = 'Critical';
  }
  
  const ratingElement = document.getElementById('wlqiRating');
  ratingElement.textContent = rating;
  ratingElement.className = 'wlqi-rating ' + ratingClass;
  
  // Display dimension breakdown (estimated based on team average)
  displayBreakdown(scores);
  
  // Render radar chart
  renderRadarChart(scores);
  
  // Generate team-specific recommendations
  generateRecommendations(scores);
  
  // Show team summary
  displayTeamSummaryFromCollectedScores(teamAvgScore, scores, memberCount);
  
  // Show results
  const resultsBox = document.getElementById('results');
  resultsBox.classList.add('show');
  
  // Show share buttons
  const shareContainer = document.getElementById('shareButtonsContainer');
  if (shareContainer) {
    shareContainer.style.display = 'block';
  }
  
  // Scroll to results
  setTimeout(() => {
    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Display team summary from collected scores
function displayTeamSummaryFromCollectedScores(avgScore, scores, memberCount) {
  const teamSummaryBox = document.getElementById('teamSummaryBox');
  const teamStatsGrid = document.getElementById('teamStatsGrid');
  
  if (!teamSummaryBox || !teamStatsGrid) return;
  
  // Find weakest and strongest areas
  const dimensions = [
    { name: 'Productivity', score: scores.productivity },
    { name: 'Meetings', score: scores.meetings },
    { name: 'Burnout Risk', score: scores.burnout },
    { name: 'Physical', score: scores.physical },
    { name: 'Mental', score: scores.mental },
    { name: 'Work-Life', score: scores.workLife },
    { name: 'Environment', score: scores.environment },
    { name: 'Financial', score: scores.financial }
  ];
  
  if (isTimezoneWork && scores.timezone !== null) {
    dimensions.push({ name: 'Timezone', score: scores.timezone });
  }
  
  dimensions.sort((a, b) => a.score - b.score);
  const weakestArea = dimensions[0].name;
  const strongestArea = dimensions[dimensions.length - 1].name;
  
  // Calculate risk level
  let riskLevel = 'Low';
  let riskColor = '#10b981';
  if (avgScore < 40) {
    riskLevel = 'Critical';
    riskColor = '#ef4444';
  } else if (avgScore < 60) {
    riskLevel = 'High';
    riskColor = '#f97316';
  } else if (avgScore < 75) {
    riskLevel = 'Moderate';
    riskColor = '#fbbf24';
  }
  
  // Collect individual scores for display
  const scoreInputs = document.querySelectorAll('.member-score');
  let scoresHtml = '';
  let minScore = 100, maxScore = 0;
  
  scoreInputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      if (value < minScore) minScore = value;
      if (value > maxScore) maxScore = value;
    }
  });
  
  teamStatsGrid.innerHTML = `
    <div class="team-stat">
      <div class="team-stat-value">${memberCount}</div>
      <div class="team-stat-label">Team Members</div>
    </div>
    <div class="team-stat">
      <div class="team-stat-value">${avgScore}</div>
      <div class="team-stat-label">Team Average Score</div>
    </div>
    <div class="team-stat">
      <div class="team-stat-value">${Math.round(minScore)} - ${Math.round(maxScore)}</div>
      <div class="team-stat-label">Score Range</div>
    </div>
    <div class="team-stat">
      <div class="team-stat-value" style="color: ${riskColor};">${riskLevel}</div>
      <div class="team-stat-label">Burnout Risk Level</div>
    </div>
    <div class="team-stat">
      <div class="team-stat-value" style="font-size: 1.2rem;">${weakestArea}</div>
      <div class="team-stat-label">Focus Area</div>
    </div>
    <div class="team-stat">
      <div class="team-stat-value" style="font-size: 1.2rem;">${strongestArea}</div>
      <div class="team-stat-label">Strongest Area</div>
    </div>
  `;
  
  teamSummaryBox.style.display = 'block';
}

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
  if (isTeamMode) {
    return `Our team's Work-Life Quality Index score is ${finalWLQIScore}/100 (${finalRatingText}). Assess your team's work-life balance:`;
  }
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

function copyWLQIToClipboard() {
  const url = getShareUrl();
  const text = `${getShareText()} ${url}`;
  
  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.getElementById('shareCopyBtn');
    if (copyBtn) {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span style="line-height:1;">✓</span>';
      copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please try again.');
  });
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
  lastRadarScores = scores;
  
  // Get team info if in team mode
  if (isTeamMode) {
    teamName = document.getElementById('teamName').value || 'Your Team';
    teamSize = parseInt(document.getElementById('teamSize').value) || 5;
  }
  
  // Update score display
  document.getElementById('wlqiScore').textContent = finalScore;
  
  // Determine rating
  let rating = '';
  let ratingClass = '';
  
  if (finalScore >= 90) {
    rating = isTeamMode ? '🌟 Team Thriving' : '🌟 Thriving';
    ratingClass = 'thriving';
    finalRatingText = 'Thriving';
  } else if (finalScore >= 75) {
    rating = isTeamMode ? '✅ Team Healthy' : '✅ Healthy';
    ratingClass = 'healthy';
    finalRatingText = 'Healthy';
  } else if (finalScore >= 60) {
    rating = isTeamMode ? '⚖️ Team Stable' : '⚖️ Stable';
    ratingClass = 'stable';
    finalRatingText = 'Stable';
  } else if (finalScore >= 40) {
    rating = isTeamMode ? '⚠️ Team Struggling' : '⚠️ Struggling';
    ratingClass = 'struggling';
    finalRatingText = 'Struggling';
  } else {
    rating = isTeamMode ? '🚨 Team Critical' : '🚨 Critical';
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
  
  // Show team summary if in team mode
  displayTeamSummary(finalScore, scores);
  
  // Show results
  const resultsBox = document.getElementById('results');
  resultsBox.classList.add('show');
  
  // Show share buttons
  const shareContainer = document.getElementById('shareButtonsContainer');
  if (shareContainer) {
    shareContainer.style.display = 'block';
  }
  
  // Scroll to results
  setTimeout(() => {
    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Display team summary (Team Mode only)
function displayTeamSummary(finalScore, scores) {
  const teamSummaryBox = document.getElementById('teamSummaryBox');
  const teamStatsGrid = document.getElementById('teamStatsGrid');
  
  if (!teamSummaryBox || !teamStatsGrid) return;
  
  if (isTeamMode) {
    // Find weakest areas
    const dimensions = [
      { name: 'Productivity', score: scores.productivity },
      { name: 'Meetings', score: scores.meetings },
      { name: 'Burnout Risk', score: scores.burnout },
      { name: 'Physical', score: scores.physical },
      { name: 'Mental', score: scores.mental },
      { name: 'Work-Life', score: scores.workLife },
      { name: 'Environment', score: scores.environment },
      { name: 'Financial', score: scores.financial }
    ];
    
    if (isTimezoneWork && scores.timezone !== null) {
      dimensions.push({ name: 'Timezone', score: scores.timezone });
    }
    
    dimensions.sort((a, b) => a.score - b.score);
    const weakestArea = dimensions[0].name;
    const strongestArea = dimensions[dimensions.length - 1].name;
    
    // Calculate risk level
    let riskLevel = 'Low';
    let riskColor = '#10b981';
    if (finalScore < 40) {
      riskLevel = 'Critical';
      riskColor = '#ef4444';
    } else if (finalScore < 60) {
      riskLevel = 'High';
      riskColor = '#f97316';
    } else if (finalScore < 75) {
      riskLevel = 'Moderate';
      riskColor = '#fbbf24';
    }
    
    teamStatsGrid.innerHTML = `
      <div class="team-stat">
        <div class="team-stat-value">${teamSize}</div>
        <div class="team-stat-label">Team Members</div>
      </div>
      <div class="team-stat">
        <div class="team-stat-value">${finalScore}</div>
        <div class="team-stat-label">Team WLQI Score</div>
      </div>
      <div class="team-stat">
        <div class="team-stat-value" style="color: ${riskColor};">${riskLevel}</div>
        <div class="team-stat-label">Burnout Risk Level</div>
      </div>
      <div class="team-stat">
        <div class="team-stat-value" style="font-size: 1.2rem;">${weakestArea}</div>
        <div class="team-stat-label">Weakest Area</div>
      </div>
      <div class="team-stat">
        <div class="team-stat-value" style="font-size: 1.2rem;">${strongestArea}</div>
        <div class="team-stat-label">Strongest Area</div>
      </div>
    `;
    
    teamSummaryBox.style.display = 'block';
  } else {
    teamSummaryBox.style.display = 'none';
  }
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

  const isCompact = window.innerWidth <= 520;
  const labels = getRadarLabels(isCompact);
  
  const pointLabelSize = isCompact ? 10 : (window.innerWidth <= 768 ? 11 : 12);
  const tickFontSize = isCompact ? 9 : (window.innerWidth <= 768 ? 10 : 11);
  const chartPadding = isCompact ? 6 : 12;
  const pointRadius = isCompact ? 3 : 4;
  const pointHoverRadius = isCompact ? 5 : 6;

  const values = [
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
    labels.push(isCompact ? ['Time', 'Zone'] : 'Timezone');
    values.push(scores.timezone);
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
        data: values,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgb(139, 92, 246)',
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        pointRadius: pointRadius,
        pointHoverRadius: pointHoverRadius
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: !isCompact,
      layout: {
        padding: chartPadding
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          min: 0,
          ticks: {
            stepSize: 20,
            color: textColor,
            backdropColor: 'transparent',
            font: {
              size: tickFontSize
            }
          },
          grid: {
            color: gridColor
          },
          pointLabels: {
            color: textColor,
            font: {
              size: pointLabelSize,
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

function getRadarLabels(isCompact) {
  const baseLabels = [
    'Productivity',
    'Meetings',
    'Burnout Risk',
    'Physical Health',
    'Mental Wellbeing',
    'Work-Life Balance',
    'Environment',
    'Financial/Commute'
  ];

  if (!isCompact) {
    return baseLabels;
  }

  return baseLabels.map((label) => {
    if (label.includes('/')) {
      return label.split('/');
    }
    const parts = label.split(' ');
    if (parts.length <= 1) {
      return label;
    }
    if (parts.length === 2) {
      return parts;
    }
    return [parts[0], parts.slice(1).join(' ')];
  });
}

function scheduleRadarResize() {
  if (!lastRadarScores) {
    return;
  }
  if (radarResizeTimeout) {
    clearTimeout(radarResizeTimeout);
  }
  radarResizeTimeout = setTimeout(() => {
    renderRadarChart(lastRadarScores);
  }, 150);
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
  
  let html = isTeamMode ? '<h3>📋 Team Improvement Recommendations</h3>' : '<h3>📋 Personalized Recommendations</h3>';
  html += isTeamMode 
    ? '<p style="color: var(--text-weak-light); margin-bottom: 2rem;">Focus on these team-wide areas for maximum impact:</p>'
    : '<p style="color: var(--text-weak-light); margin-bottom: 2rem;">Focus on improving these two areas for maximum impact on your work-life quality:</p>';
  
  weakest.forEach(dim => {
    html += `<div class="recommendation-section">`;
    html += `<h4>${dim.name} (Score: ${Math.round(dim.score)}/100)</h4>`;
    html += `<ul>${isTeamMode ? getTeamRecommendationsForDimension(dim.key) : getRecommendationsForDimension(dim.key)}</ul>`;
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

// Get team-specific recommendations for each dimension
function getTeamRecommendationsForDimension(key) {
  const recommendations = {
    productivity: `
      <li><strong>Implement team-wide "focus time" blocks</strong> where no meetings are scheduled (e.g., mornings)</li>
      <li><strong>Reduce meeting frequency</strong>—audit recurring meetings and eliminate those that could be async</li>
      <li><strong>Create clear communication channels</strong>—designate urgent vs. non-urgent channels to reduce interruptions</li>
      <li>Consider implementing "no-meeting days" like Wednesdays or Fridays for deep work</li>
    `,
    meetings: `
      <li><strong>Audit all team meetings</strong>—cancel those without clear agendas or outcomes</li>
      <li><strong>Set team-wide meeting guidelines:</strong> 25/50 min meetings, mandatory agendas, optional attendance for updates</li>
      <li><strong>Default to async communication</strong>—use Loom, Slack threads, or docs instead of live calls</li>
      <li>Implement a "meeting-free" day each week for focused work time</li>
    `,
    burnout: `
      <li><strong>Evaluate team workload distribution</strong>—are some members consistently overloaded?</li>
      <li><strong>Set clear expectations about work hours</strong>—discourage after-hours communication</li>
      <li><strong>Encourage PTO usage</strong>—lead by example and ensure team members take breaks</li>
      <li>Consider hiring additional support or redistributing responsibilities if workload is unsustainable</li>
    `,
    physical: `
      <li><strong>Provide ergonomic equipment</strong> stipends or reimbursements for home office setups</li>
      <li><strong>Encourage walking meetings</strong> for 1:1s or brainstorming sessions</li>
      <li><strong>Promote wellness initiatives</strong>—standing desk options, fitness challenges, or gym memberships</li>
      <li>Schedule periodic "stretch breaks" or walking meetings into team routines</li>
    `,
    mental: `
      <li><strong>Schedule regular team social activities</strong>—virtual coffee chats, game sessions, or team lunches</li>
      <li><strong>Create psychological safety</strong>—encourage open conversations about workload and stress</li>
      <li><strong>Provide mental health resources</strong>—EAP access, meditation app subscriptions, or counseling benefits</li>
      <li>Hold regular 1:1s focused on wellbeing, not just work progress</li>
    `,
    workLife: `
      <li><strong>Model healthy boundaries</strong>—managers should avoid sending messages after hours</li>
      <li><strong>Implement "right to disconnect" policies</strong>—no expectation to respond outside work hours</li>
      <li><strong>Review workload realistically</strong>—are deadlines causing chronic overtime?</li>
      <li>Use delayed send features on email and messaging to respect team members' personal time</li>
    `,
    environment: `
      <li><strong>Provide home office stipends</strong> for ergonomic chairs, monitors, and proper lighting</li>
      <li><strong>For hybrid teams:</strong> ensure office space is conducive to focused work (quiet zones)</li>
      <li><strong>Address noise and distraction issues</strong>—provide noise-canceling headphones or quiet spaces</li>
      <li>Survey team members about their workspace needs and address common pain points</li>
    `,
    financial: `
      <li><strong>Offer flexible work options</strong> to reduce commute burden and costs</li>
      <li><strong>Provide commuter benefits</strong>—transit passes, parking subsidies, or carpooling incentives</li>
      <li><strong>Consider fully remote options</strong> for roles that don't require in-office presence</li>
      <li>If relocation is common, provide relocation assistance or flexible start dates</li>
    `,
    timezone: `
      <li><strong>Rotate meeting times</strong>—don't always burden the same team members with inconvenient hours</li>
      <li><strong>Maximize async work</strong>—reduce synchronous meeting requirements through documentation</li>
      <li><strong>Define "core hours"</strong>—minimize required overlap and let team members flex outside those hours</li>
      <li>Consider hiring in more time-zone-friendly regions to reduce overlap strain</li>
    `
  };
  
  return recommendations[key] || '<li>Discuss this area as a team and identify improvements together</li>';
}

