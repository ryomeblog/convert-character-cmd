const { OpenAI } = require('openai');

const fetchAiChatResponse = async (prompt, apiKey) => {
  const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4o-mini',
  });

  return response;
};

module.exports = { fetchAiChatResponse };