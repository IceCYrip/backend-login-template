const htmlToSend = (userDetails) => {
  const backendURL = 'http://localhost:5000'

  switch (userDetails?.language) {
    case 'en':
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

    case 'de':
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
