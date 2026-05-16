const OpenAI = requires('openai')

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})

const processStandup = async (rawText, engineerName) => {
    const response = await client.chat.completions.create({
        model: 'mistralai/mistral-7b-instruct:free',
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
                content: `Engineer ${engineerName}\n Standup: ${rawText}`
            }
        ]
    })
    const text = response.choices[0].message.content
    return JSON.parse(text)
}

module.exports = { processStandup }