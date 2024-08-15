const nodemailer = require('nodemailer')

const backendURL = 'http://localhost:5000'
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
    html: `<div>
        <label>Dear ${userDetails?.fullName},</label> 
        <br />
        <label>Please <a href='${backendURL}/api/verify/${userDetails?.id}' >
          click here
        </a>to verify your email.</label>
        <br />
        <label>Thanks</label>
      </div>`,
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
  //  transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error)
  //       return { mailSent: false, message: error.message }
  //     } else {
  //       console.log('Email sent: ', info.response)

  //       return {
  //         mailSent: true,
  //         message:
  //           'An email has been sent to you for verification. Please verify your email to login',
  //       }
  //     }
  //   })
}

module.exports = emailService
