const pool = require('../config/db')
const { sendWeeklyReport } = require('./email')

async function generateWeeklyReport() {
  // Get all standups from the last 7 days
  const result = await pool.query(`
    SELECT * FROM standups 
    WHERE created_at >= NOW() - INTERVAL '7 days'
    ORDER BY engineer_name, created_at DESC
  `)

  const standups = result.rows

  if (standups.length === 0) {
    console.log('No standups this week, skipping report')
    return
  }

  // Group standups by engineer
  const byEngineer = {}
  for (const standup of standups) {
    if (!byEngineer[standup.engineer_name]) {
      byEngineer[standup.engineer_name] = []
    }
    byEngineer[standup.engineer_name].push(standup)
  }

  // Build report text
  let report = `Weekly Standup Report\n`
  report += `Week ending: ${new Date().toLocaleDateString()}\n`
  report += `${'='.repeat(40)}\n\n`

  for (const [engineer, standups] of Object.entries(byEngineer)) {
    report += `👤 ${engineer}\n`
    report += `Standups this week: ${standups.length}\n`

    const allBlockers = standups
      .filter(s => s.has_blockers)
      .flatMap(s => s.blockers)

    if (allBlockers.length > 0) {
      report += `Blockers: ${allBlockers.length} reported\n`
    } else {
      report += `Blockers: None 🎉\n`
    }

    report += `Latest update: ${standups[0].summary}\n`
    report += `\n`
  }

  // Send to all leads
  const leads = await pool.query("SELECT email FROM users WHERE role = 'lead'")
  for (const lead of leads.rows) {
    await sendWeeklyReport(lead.email, report)
  }

  console.log('Weekly report sent!')
}

module.exports = { generateWeeklyReport }