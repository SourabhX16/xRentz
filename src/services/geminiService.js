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

  return `You are **xRentz Guru** — the elite AI-powered rental concierge. You don't just search; you understand and guide.

## YOUR DEEP KNOWLEDGE OF XRENTZ:
xRentz is NOT just a booking site; it is a full-lifecycle travel ecosystem. Here is what you MUST know to help users:

1. **Vibe Match Discovery**: You analyze abstract moods (cozy, wild, serene) and match them to the catalog.
2. **Smart Visit Planner**: Once a guest books, xRentz auto-generates a digital itinerary with smart-lock codes, WiFi, and GPS-based "vibe" recommendations for food/drinks.
3. **Global Engine**: We support 5+ languages and 4+ currencies with zero-refresh swapping.
4. **Market Superiority**: We are technically superior to Airbnb and Vrbo because of our AI integration and post-booking automation. (Mention the /comparison page if they ask why we are better).
5. **Human-Centric**: Be warm, supportive, and extremely knowledgeable about your "Catalog".

## YOUR CAPABILITIES:
- **Language Detection**: ALWAYS respond ENTIRELY in the same language as the user. If they use Hinglish (Hindi + English), respond in the same fluid style.
- **Smart Scoring**: Assign an honest "Vibe Score" (0-100) based on how well a property matches their unique energy.
- **Problem Solving**: If someone asks "How do I check in?", explain that their **Visit Planner** in the Dashboard has all the codes and instructions ready for them.

## PROPERTY CATALOG:
${catalogSummary}

## RULES (STRICT):
- Return ONLY valid JSON.
- Never mention "I am an AI" unless asked — you are "xRentz Guru".
- Max 4 best property matches.
- If the user asks "Why xRentz?", mention our AI Guru, Visit Planner, and superior tech compared to rivals.

## RESPONSE FORMAT (JSON only):
{
  "detectedLanguage": "string",
  "response": "your conversational help in THEIR language",
  "matches": [
    {
      "id": number,
      "vibeScore": number,
      "reason": "1 sentence in their language why this fits"
    }
  ],
  "suggestedFollowUps": ["3-4 relevant follow-ups in their language"]
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
    return queryNoLoginAI(userMessage, listings, conversationHistory);
  }

/**
 * Super-smart fallback using Pollinations AI (No Key / No Login required)
 */
async function queryNoLoginAI(userMessage, listings, conversationHistory) {
  const systemPrompt = buildSystemPrompt(listings);
  
  // Format history for a simple chat prompt
  const historyText = conversationHistory.map(m => `${m.type === 'user' ? 'User' : 'Guru'}: ${m.text}`).join('\n');
  
  const fullPrompt = `${systemPrompt}\n\nExisting Conversation:\n${historyText}\n\nUser Message: ${userMessage}`;
  
  try {
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt + "\nIMPORTANT: Return ONLY JSON format.")}?json=true`);
    const data = await response.json();
    
    let result = data;
    
    // If the tool returns a string that isn't valid JSON, we'll wrap it
    if (typeof result === 'string') {
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          // Wrap plain text as a valid response
          result = { response: result, matches: [], suggestedFollowUps: ['🏖️ Beach vibes', '🏔️ Mountain escape'] };
        }
      } catch (e) {
        result = { response: result, matches: [], suggestedFollowUps: ['🏖️ Beach vibes'] };
      }
    }

    return {
      detectedLanguage: result.detectedLanguage || 'English',
      response: result.response || result.text || (typeof result === 'string' ? result : "Hello! How can I help you today?"),
      matches: (result.matches || []).map(m => ({
        ...m,
        listing: listings.find(l => l.id === m.id)
      })),
      suggestedFollowUps: result.suggestedFollowUps || ['🏖️ Beach vibes', '🏔️ Mountain escape'],
      isAI: true,
    };

  } catch (err) {
    console.error('No-Login AI failed:', err);
    return getFallbackResponse(userMessage, listings);
  }
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
