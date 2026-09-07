export interface ProjectInput {
  projectTitle: string;
  projectDescription: string;
  budget?: number;
  category?: string;
  targetGroup?: string;
  region?: string;
}

export interface MatchResult {
  grantId: string;
  grantTitle: string;
  foundationName: string;
  matchScore: number; // 0 - 100
  matchStrengths: string[];
  tipsForApplication: string;
  budgetFit: 'optimal' | 'acceptable' | 'too_high' | 'too_low' | 'unknown';
  deadlineInfo: {
    daysRemaining: number | null;
    isOngoing: boolean;
    date: string | null;
    signalColor: 'urgent' | 'warning' | 'calm' | 'ongoing';
  };
}

/**
 * Calculates days remaining from today to deadline date
 */
export function getDaysRemaining(deadlineStr: string | null): number | null {
  if (!deadlineStr) return null;
  const target = new Date(deadlineStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines signal color code based on urgency
 */
export function getSignalColor(isOngoing: boolean, daysRemaining: number | null): 'urgent' | 'warning' | 'calm' | 'ongoing' {
  if (isOngoing || daysRemaining === null) return 'ongoing';
  if (daysRemaining <= 14) return 'urgent';
  if (daysRemaining <= 30) return 'warning';
  return 'calm';
}

/**
 * Evaluates budget fit relative to grant minimum and maximum
 */
export function evaluateBudgetFit(budget?: number, minAmount?: number | null, maxAmount?: number | null) {
  if (!budget || (!minAmount && !maxAmount)) return 'acceptable';
  if (minAmount && budget < minAmount) return 'too_low';
  if (maxAmount && budget > maxAmount) return 'too_high';
  return 'optimal';
}

/**
 * Heuristic and semantic scoring engine
 */
export function calculateMatch(
  project: ProjectInput,
  grant: {
    id: string;
    title: string;
    description: string;
    categories: string[];
    targetGroups: string[];
    minAmount: number | null;
    maxAmount: number | null;
    currency: string;
    region: string;
    foundation: { name: string };
    deadlines: { deadlineDate: string | null; isOngoing: boolean; notes: string | null }[];
  }
): MatchResult {
  let score = 30; // base potential
  const strengths: string[] = [];

  const textToScan = `${project.projectTitle} ${project.projectDescription} ${project.category || ''} ${project.targetGroup || ''}`.toLowerCase();
  const grantText = `${grant.title} ${grant.description} ${grant.categories.join(' ')} ${grant.targetGroups.join(' ')}`.toLowerCase();

  // 1. Category Alignment (up to +35 pts)
  let categoryMatches = 0;
  for (const cat of grant.categories) {
    if (textToScan.includes(cat.toLowerCase())) {
      categoryMatches++;
    }
  }
  if (categoryMatches > 0) {
    const pts = Math.min(categoryMatches * 15, 35);
    score += pts;
    strengths.push(`Matcher kategorier: ${grant.categories.slice(0, 3).join(', ')}`);
  }

  // 2. Target Group Alignment (up to +20 pts)
  for (const tg of grant.targetGroups) {
    if (textToScan.includes(tg.toLowerCase()) || textToScan.includes(tg.toLowerCase().slice(0, -2))) {
      score += 12;
      strengths.push(`Støtter din målgruppe: ${tg}`);
      break;
    }
  }

  // Specific common keywords
  const keywords = ['unge', 'børn', 'kultur', 'kunst', 'musik', 'teater', 'fællesskab', 'trivsel', 'miljø', 'frivillig', 'bæredygtig', 'lokal'];
  let kwHits = 0;
  for (const kw of keywords) {
    if (textToScan.includes(kw) && grantText.includes(kw)) {
      kwHits++;
    }
  }
  score += Math.min(kwHits * 5, 20);

  // 3. Budget Alignment
  const budgetStatus = evaluateBudgetFit(project.budget, grant.minAmount, grant.maxAmount);
  if (budgetStatus === 'optimal' && project.budget) {
    score += 15;
    strengths.push(`Budgettet (${project.budget.toLocaleString('da-DK')} ${grant.currency}) passer inden for puljens rammer`);
  } else if (budgetStatus === 'too_high') {
    score -= 20;
  } else if (budgetStatus === 'too_low') {
    score -= 10;
  }

  // 4. Region Match
  if (grant.region === 'EU' && !textToScan.includes('eu') && !textToScan.includes('international') && !textToScan.includes('europa')) {
    score -= 15;
  }

  // Clamp score
  const finalScore = Math.max(15, Math.min(98, score));

  // Determine primary deadline
  const primaryDeadline = grant.deadlines[0] || { deadlineDate: null, isOngoing: true, notes: null };
  const days = getDaysRemaining(primaryDeadline.deadlineDate);
  const signal = getSignalColor(primaryDeadline.isOngoing, days);

  // Application advice
  let tips = `Husk at relatere projektets formål eksplicit til ${grant.foundation.name}s formål og vurderingskriterier.`;
  if (grant.categories.includes('Social') || grant.categories.includes('Børn & Unge')) {
    tips = `Læg stor vægt på målgruppens direkte udbytte, trivsel og hvordan effekten dokumenteres/evalueres.`;
  } else if (grant.categories.includes('Kultur') || grant.categories.includes('Scenekunst')) {
    tips = `Fremhæv den kunstneriske kvalitet, nytænkning og hvordan projektet når ud til publikum.`;
  } else if (grant.region === 'EU') {
    tips = `Kræver stærkt europæisk partnerskab (min. 3 lande). Fokuser på transnational merværdi og videndeling.`;
  }

  return {
    grantId: grant.id,
    grantTitle: grant.title,
    foundationName: grant.foundation.name,
    matchScore: finalScore,
    matchStrengths: strengths.length > 0 ? strengths : ['Generel overensstemmelse med fondens formålsområde'],
    tipsForApplication: tips,
    budgetFit: budgetStatus,
    deadlineInfo: {
      daysRemaining: days,
      isOngoing: primaryDeadline.isOngoing,
      date: primaryDeadline.deadlineDate,
      signalColor: signal
    }
  };
}
