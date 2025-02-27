import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    // Create a transporter using SMTP configuration
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: Number(process.env.SMTP_PORT), // Convert port to number
      secure: process.env.SMTP_PORT == 465, // Use secure connection for port 465
      auth: {
        user: process.env.SMTP_MAIL, // SMTP email
        pass: process.env.SMTP_PASSWORD, // SMTP password
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.SMTP_MAIL, // Sender's email
      to: email, // Recipient's email
      subject: subject, // Email subject
      text: message, // Email content (plain text)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};