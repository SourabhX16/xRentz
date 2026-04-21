/**
 * Gemini AI Service for xRentz Vibe Match Engine
 * 
 * Handles all communication with Google's Gemini API to provide:
 * - Natural language understanding for property search
 * - Vibe Score ranking (0-100%) for each matching property
 * - Multi-language auto-detection and response
 * - Structured JSON responses for UI rendering
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Build the system prompt that instructs Gemini how to behave
 */
function buildSystemPrompt(listings) {
  const catalogSummary = listings.map(l => (
    `ID:${l.id} | "${l.title}" | ${l.category} | ${l.location} | $${l.price}/night | ${l.guests} guests | ${l.bedrooms} bed | ${l.bathrooms} bath | Amenities: ${l.amenities.join(', ')} | Rating: ${l.rating} (${l.reviews} reviews) | ${l.superhost ? 'SUPERHOST' : ''} | "${l.description}"`
  )).join('\n');

  return `You are **xRentz Guru** — the world's first AI-powered rental concierge. You help guests discover their perfect stay based on their vibe, mood, and needs.

## YOUR CAPABILITIES:
1. **Vibe Matching**: Understand abstract vibes like "cozy", "romantic", "adventure", "peace", "party" and match them to properties
2. **Multi-Language**: ALWAYS detect the user's language and respond ENTIRELY in that SAME language. If they write in Hindi, respond in Hindi. If Spanish, respond in Spanish. etc.
3. **Smart Ranking**: Score each matching property with a "Vibe Score" from 0-100 based on how well it matches the user's described ideal
4. **Conversational**: Be warm, enthusiastic, and knowledgeable. Use emojis naturally. Keep responses concise (2-3 sentences max for the main text)

## PROPERTY CATALOG:
${catalogSummary}

## RULES:
- Return ONLY valid JSON. No markdown, no code fences, no extra text.
- Match at most 3-4 best properties. Quality over quantity.
- If NO properties match at all, return empty matches array and suggest what vibes ARE available.
- vibeScore must be an integer 0-100. Be honest — don't give everything 95+.
- "reason" should be 1 short sentence explaining WHY this property matches their vibe in the SAME language as the response.
- If the user asks a general question (not about finding a property), respond helpfully and return empty matches.
- If user mentions specific amenities (like "no wifi", "must have pool"), factor that into scoring.
- If user mentions budget, filter accordingly.
- If user mentions number of guests, ensure property capacity fits.

## RESPONSE FORMAT (JSON only):
{
  "detectedLanguage": "the language name in English, e.g. Hindi, Spanish, English",
  "response": "your conversational response to the user in THEIR language",
  "matches": [
    {
      "id": <listing id number>,
      "vibeScore": <0-100>,
      "reason": "short reason in user's language"
    }
  ],
  "suggestedFollowUps": ["suggestion 1 in user's language", "suggestion 2"]
}`;
}

/**
 * Send a message to Gemini and get AI-powered property recommendations
 * 
 * @param {string} userMessage - The user's natural language query
 * @param {Array} listings - All available property listings
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Object} Parsed AI response with matches and vibe scores
 */
export async function queryGeminiForVibeMatch(userMessage, listings, conversationHistory = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return getFallbackResponse(userMessage, listings);
  }

  const systemPrompt = buildSystemPrompt(listings);

  // Build conversation context for multi-turn awareness
  const contents = [];

  // System instruction as the first user turn
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\nThe conversation begins now. Remember: respond ONLY with valid JSON.' }]
  });
  contents.push({
    role: 'model',
    parts: [{ text: '{"detectedLanguage":"English","response":"Hello! I\'m xRentz Guru, your AI concierge. Tell me your vibe and I\'ll find your perfect stay! 🌟","matches":[],"suggestedFollowUps":["🏖️ Beach vibes","🏔️ Mountain escape","💎 Luxury stay","🏙️ City adventure"]}' }]
  });

  // Add previous conversation turns (last 6 messages for context)
  const recentHistory = conversationHistory.slice(-6);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.type === 'user' ? msg.text : JSON.stringify(msg.rawAI || { response: msg.text }) }]
    });
  }

  // Current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      return getFallbackResponse(userMessage, listings);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('Empty Gemini response:', data);
      return getFallbackResponse(userMessage, listings);
    }

    // Parse the JSON response — handle potential markdown fences
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsed = JSON.parse(cleaned);
    
    // Validate and sanitize the response
    return {
      detectedLanguage: parsed.detectedLanguage || 'English',
      response: parsed.response || "I found some great options for you!",
      matches: (parsed.matches || []).filter(m => 
        m.id && typeof m.vibeScore === 'number' && listings.some(l => l.id === m.id)
      ).map(m => ({
        ...m,
        vibeScore: Math.min(100, Math.max(0, Math.round(m.vibeScore))),
        listing: listings.find(l => l.id === m.id)
      })),
      suggestedFollowUps: parsed.suggestedFollowUps || [],
      isAI: true,
    };
  } catch (err) {
    console.error('Gemini service error:', err);
    return getFallbackResponse(userMessage, listings);
  }
}

/**
 * Intelligent fallback when Gemini API is unavailable
 * Uses local keyword matching with basic vibe scoring
 */
function getFallbackResponse(userMessage, listings) {
  const msg = userMessage.toLowerCase();
  let matched = [];

  const vibeMap = {
    beach: { keywords: ['beach', 'ocean', 'sea', 'coastal', 'surf', 'wave', 'playa', 'समुद्र', 'समंदर'], categories: ['villa'], locations: ['malibu', 'goa', 'miami', 'kerala'] },
    mountain: { keywords: ['mountain', 'snow', 'cabin', 'hiking', 'trek', 'ski', 'montaña', 'पहाड़', 'बर्फ'], categories: ['cabin'], locations: ['aspen', 'manali', 'colorado', 'tahoe'] },
    city: { keywords: ['city', 'downtown', 'urban', 'nightlife', 'metro', 'ciudad', 'शहर'], categories: ['penthouse', 'loft', 'apartment'], locations: ['manhattan', 'chicago', 'mumbai', 'bengaluru'] },
    luxury: { keywords: ['luxury', 'expensive', 'premium', 'elite', 'vip', 'lujo', 'लक्ज़री'], categories: ['penthouse', 'villa'], locations: [] },
    peaceful: { keywords: ['quiet', 'peace', 'calm', 'serene', 'relax', 'tranquil', 'शांत', 'paz'], categories: ['cabin', 'house', 'studio'], locations: ['pondicherry', 'udaipur', 'alleppey'] },
    creative: { keywords: ['art', 'creative', 'studio', 'bohemian', 'design', 'कला'], categories: ['studio', 'loft'], locations: ['portland', 'pondicherry'] },
  };

  let bestVibe = null;
  let bestScore = 0;

  for (const [vibe, config] of Object.entries(vibeMap)) {
    const score = config.keywords.filter(k => msg.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestVibe = vibe;
    }
  }

  if (bestVibe) {
    const config = vibeMap[bestVibe];
    matched = listings
      .map(l => {
        let score = 0;
        const text = (l.category + l.location + l.title + l.description).toLowerCase();
        
        if (config.categories.includes(l.category)) score += 40;
        if (config.locations.some(loc => text.includes(loc))) score += 30;
        if (config.keywords.some(k => text.includes(k))) score += 20;
        if (l.superhost) score += 5;
        if (l.rating >= 4.9) score += 5;
        
        return { id: l.id, vibeScore: Math.min(98, score), listing: l, reason: `Great match for your ${bestVibe} vibe` };
      })
      .filter(m => m.vibeScore > 20)
      .sort((a, b) => b.vibeScore - a.vibeScore)
      .slice(0, 3);
  } else {
    // General search
    matched = listings
      .filter(l => {
        const text = (l.location + l.title + l.description + l.category).toLowerCase();
        return msg.split(' ').some(word => word.length > 2 && text.includes(word));
      })
      .slice(0, 3)
      .map(l => ({ id: l.id, vibeScore: 70, listing: l, reason: 'Matched your search' }));
  }

  return {
    detectedLanguage: 'English',
    response: matched.length > 0 
      ? `Based on your vibe, I found ${matched.length} great match${matched.length > 1 ? 'es' : ''}! Here are my top picks:` 
      : "I couldn't find an exact match. Try describing your ideal vibe — like 'peaceful mountain cabin' or 'luxury beachfront'!",
    matches: matched,
    suggestedFollowUps: ['🏖️ Beach vibes', '🏔️ Mountain escape', '💎 Luxury stay', '🏙️ City adventure'],
    isAI: false,
  };
}
