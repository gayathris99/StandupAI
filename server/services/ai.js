const OpenAI = require('openai')

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY
})

async function processStandup(rawText, engineerName) {
  console.log('Calling AI...')
  
  const response = await client.chat.completions.create({
    model: 'nvidia/nemotron-3-super-120b-a12b:free',
    messages: [
      {
        role: 'system',
        content: `You are a standup assistant. Extract structured information from engineer standups.
Always respond with valid JSON only, no extra text, no markdown, no backticks.
Format:
{
  "summary": "one sentence summary",
  "tasks_completed": ["task1", "task2"],
  "tasks_planned": ["task1", "task2"],
  "blockers": [{"description": "blocker", "severity": "high|medium|low"}],
  "has_blockers": true or false
}`
      },
      {
        role: 'user',
        content: `Engineer: ${engineerName}\nStandup: ${rawText}`
      }
    ]
  })

  console.log('AI response received!')
  console.log('Raw response:', response.choices[0].message.content)

  const text = response.choices[0].message.content
  return JSON.parse(text)
}

module.exports = { processStandup }