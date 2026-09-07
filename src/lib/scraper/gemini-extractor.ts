export interface ExtractedGrantData {
  deadlines: string[];
  isOngoing: boolean;
  minAmount?: number | null;
  maxAmount?: number | null;
  summary: string;
}

/**
 * Heuristic fallback parser when no GEMINI_API_KEY is available or API is unreachable
 */
function extractWithHeuristics(content: string, foundationName: string): ExtractedGrantData {
  const deadlines: string[] = [];
  
  // Look for ongoing keywords
  const isOngoing = /løbende\s+(?:ansøgning|behandling|frist)|ingen\s+fast\s+frist|ansøg\s+når\s+som\s+helst/i.test(content);

  // Look for Danish dates: e.g. "1. maj 2026", "15. oktober", "01.06.2026", "2026-06-01"
  const danishMonthRegex = /\b(\d{1,2})\.?\s*(januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)(?:\s*(\d{4}))?\b/gi;
  const isoDateRegex = /\b(202[5-9]-\d{2}-\d{2})\b/g;

  const monthMap: Record<string, string> = {
    januar: '01', februar: '02', marts: '03', april: '04',
    maj: '05', juni: '06', juli: '07', august: '08',
    september: '09', oktober: '10', november: '11', december: '12'
  };

  let match;
  while ((match = danishMonthRegex.exec(content)) !== null) {
    const day = match[1].padStart(2, '0');
    const month = monthMap[match[2].toLowerCase()];
    const year = match[3] || '2026';
    const formatted = `${year}-${month}-${day}`;
    if (!deadlines.includes(formatted)) {
      deadlines.push(formatted);
    }
  }

  while ((match = isoDateRegex.exec(content)) !== null) {
    if (!deadlines.includes(match[1])) {
      deadlines.push(match[1]);
    }
  }

  // Look for amounts (e.g. op til 250.000 kr)
  let maxAmount: number | null = null;
  const maxAmountMatch = /(?:op\s+til|maks(?:imalt)?\.?|højst)\s*([0-9.]+)\s*(?:kr|dkk)/i.exec(content);
  if (maxAmountMatch) {
    const cleanNum = parseInt(maxAmountMatch[1].replace(/\./g, ''), 10);
    if (!isNaN(cleanNum)) maxAmount = cleanNum;
  }

  let summary = '';
  if (isOngoing) {
    summary = `${foundationName}: Løbende ansøgningsfrist detekteret på siden.`;
  } else if (deadlines.length > 0) {
    summary = `${foundationName}: Nye fristkandidater fundet: ${deadlines.slice(0, 3).join(', ')}.`;
  } else {
    summary = `${foundationName}: Indholdsændring fundet. Nye ansøgningsvilkår eller opdateringer registreret.`;
  }

  return {
    deadlines,
    isOngoing,
    maxAmount,
    summary
  };
}

/**
 * Extracts grant deadlines, application terms, and amounts using Gemini AI
 */
export async function extractGrantInfoWithGemini(
  foundationName: string,
  url: string,
  normalizedContent: string
): Promise<ExtractedGrantData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return extractWithHeuristics(normalizedContent, foundationName);
  }

  // Truncate content to avoid token overflow (~8000 chars is plenty for grant landing pages)
  const trimmedContent = normalizedContent.slice(0, 8000);

  const prompt = `Du er en præcis fondsrådgiver og crawler for det danske fondsovervågningsdashboard Fondsnyt.
Analysér følgende tekst fra fondens ansøgningsside:
Fond: ${foundationName}
Kilde URL: ${url}

Uddrag følgende information:
1. Ansøgningsfrister (deadlines): Find alle specifikke datoer (i YYYY-MM-DD format). Hvis der kun står måned og år, sæt sidste dag i måneden eller angiv datoen.
2. Er der løbende ansøgningsfrist/behandling uden fast frist? (isOngoing)
3. Maksimalt og eventuelt minimalt beløb i DKK (hvis nævnt).
4. Et præcist, velskrevet dansk resumé på 1-2 sætninger over ændringen eller de gældende frister og krav, som vises direkte på overvågningsdashboardet for en fundraiser.

Sidens indhold:
"""
${trimmedContent}
"""`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                deadlines: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'Fundne ansøgningsfrister i format YYYY-MM-DD'
                },
                isOngoing: {
                  type: 'BOOLEAN',
                  description: 'Hvorvidt puljen har løbende behandling uden fast frist'
                },
                minAmount: {
                  type: 'NUMBER',
                  description: 'Minimumsbeløb i DKK hvis nævnt'
                },
                maxAmount: {
                  type: 'NUMBER',
                  description: 'Maksimumbeløb i DKK hvis nævnt'
                },
                summary: {
                  type: 'STRING',
                  description: 'Kort dansk resumé (1-2 sætninger) over frister og krav'
                }
              },
              required: ['deadlines', 'isOngoing', 'summary']
            }
          }
        }),
        signal: AbortSignal.timeout(12000)
      }
    );

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Falling back to heuristics.`);
      return extractWithHeuristics(normalizedContent, foundationName);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return extractWithHeuristics(normalizedContent, foundationName);
    }

    const parsed: ExtractedGrantData = JSON.parse(candidateText);
    return {
      deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines : [],
      isOngoing: Boolean(parsed.isOngoing),
      minAmount: parsed.minAmount || null,
      maxAmount: parsed.maxAmount || null,
      summary: parsed.summary || `${foundationName}: Ny frist eller ændring registreret.`
    };
  } catch (error) {
    console.error('Error in Gemini extraction, falling back to heuristics:', error);
    return extractWithHeuristics(normalizedContent, foundationName);
  }
}
