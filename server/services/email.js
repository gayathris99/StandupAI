const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendBlockerAlert = async (leadEmail, engineerName, blockers) => {
    const blockerList = blockers
    .filter(b => b.severity === 'high')
    .map(b => `• ${b.description}`)
    .join('\n')

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: leadEmail,
        subject: `🚨 High Severity Blocker - ${engineerName}`,
        text: `
        Hi,
        
        ${engineerName} has reported a high severity blocker in today's standup:
        
        ${blockerList}
        
        Please follow up immediately.
        
        — StandupAI
            `
    })
}

const sendWeeklyReport = async (leadEmail, report) => {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: leadEmail,
      subject: `📊 Weekly Standup Report - ${new Date().toLocaleDateString()}`,
      text: report
    })
  }

module.exports = { sendBlockerAlert, sendWeeklyReport }

