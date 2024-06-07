const nodemailer = require("nodemailer");
const message = require("./emailMassage");

async function sendEmail(email,subject,message) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.HOST,
        pass: process.env.PASS
      },
    });

    await transporter.sendMail({
      from: process.env.HOST,
      to: email,
      subject: subject,
      html: message
    });
    console.log("Email sent Successfully")
  }catch(error){
    console.log("Email not sent")
    console.log(error)
    return error;
  }
};

module.exports = sendEmail;

async function main() {
  const email = 'ardyprasyah@gmail.com';
  const subject = 'WOILAH ENAK';
  const msg = message("Synmary", "https://www.google.com")
  await sendEmail(email, subject, msg);
}

main();

