exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { apiKey, prompt } = JSON.parse(event.body);

    if (!apiKey || !prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Clé API ou prompt manquant.' })
      };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
      // Si l'API Google renvoie une erreur (clé invalide ou autre)
    if (!response.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data.error?.message || "Erreur de l'API Google Gemini" })
      };
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
