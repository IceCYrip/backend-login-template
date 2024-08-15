const nodemailer = require('nodemailer')
const htmlToSend = require('./htmlToSend')

const emailService = async (userDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'assignment.gophygital@gmail.com',
      pass: 'exmw zake avjo wxyo',
    },
  })

  const mailOptions = {
    from: 'assignment.gophygital@gmail.com',
    to: userDetails?.username,
    subject: 'Verify your email',
    html: htmlToSend(userDetails),
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ', info.response)
    return {
      mailSent: true,
      message:
        'An email has been sent to you for verification. Please verify your email to login',
    }
  } catch (error) {
    return { mailSent: false, message: error.message }
  }
}

module.exports = emailService
