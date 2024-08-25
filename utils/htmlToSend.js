require('dotenv').config()

const htmlToSend = (userDetails) => {
  const backendURL = process.env.DB_BACKEND_HOST

  switch (userDetails?.language) {
    case 'EN':
      return `<div>
     <label>Dear ${userDetails?.fullName},</label> 
     <br />
     <br />
     <label>Please <a href='${backendURL}/api/verify/${userDetails?.id}' >
       click here
     </a>to verify your email.</label>
     <br />
     <br />
     <label>Thanks</label>
   </div>`

    case 'DE':
      return `<div>
    <label>Lieber ${userDetails?.fullName},</label> 
    <br />
    <br />
    <label>Bitte <a href='${backendURL}/api/verify/${userDetails?.id}' >
      klicken Sie hier,
    </a>um Ihre E-Mail-Adresse zubestätigen.</label>
    <br />
    <br />
    <label>Vielen Dank</label>
  </div>`

    default:
      return 'Invalid language'
  }
}

module.exports = htmlToSend
