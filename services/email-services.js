// // import nodemailer from "nodemailer"


// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     type: 'OAuth2',
// //     user: process.env.GOOGLE_USER,
// //     clientId: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
// //   },
// // });

// // // Verify the connection configuration
// // transporter.verify((error, success) => {
// //   if (error) {
// //     console.error('Error connecting to email server:', error);
// //   } else {
// //     console.log('Email server is ready to send messages');
// //   }
// // });
// // // Function to send email
// // export const sendEmail = async (to, subject, text, html) => {
// //   try {
// //     const info = await transporter.sendMail({
// //       from: `"Saarthi" <${process.env.GOOGLE_USER}>`, // sender address
// //       to, // list of receivers
// //       subject, // Subject line
// //       text, // plain text body
// //       html, // html body
// //     });

// //     console.log('Message sent: %s', info.messageId);
// //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// //     return info;
// //   } catch (error) {
// //     console.error('Error sending email:', error);
// //     throw error;
// //   }
// // };

// // // module.exports = sendEmail;
// // // module.exports = transporter;
// import nodemailer from "nodemailer";
// // 1. Import your working config file (adjust the path to your config.js)
// import config from "../config/config.js"; 

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     // 2. Switch all 'process.env' to 'config'
//     user: config.GOOGLE_USER,
//     clientId: config.GOOGLE_CLIENT_ID,
//     clientSecret: config.GOOGLE_CLIENT_SECRET,
//     refreshToken: config.GOOGLE_REFRESH_TOKEN,
//   },
//   connectionTimeout: 5000, // 5 seconds
//   greetingTimeout: 5000,
//   socketTimeout: 5000,
// });

// // // Verify the connection configuration
// // transporter.verify((error, success) => {
// //   if (error) {
// //     console.error('Error connecting to email server:', error);
// //   } else {
// //     console.log('Email server is ready to send messages');
// //   }
// // });

// // Function to send email
// export const sendEmail = async (to, subject, text, html) => {
//   try {
//         console.log("Before sendMail");

//     const info = await transporter.sendMail({
//       // 3. Switch here as well
//       from: `"Saarthi" <${config.GOOGLE_USER}>`, 
//       to, 
//       subject, 
//       text, 
//       html, 
//     });
//     console.log("After sendMail");

//     console.log('Message sent: %s', info.messageId);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

import SibApiV3Sdk from "sib-api-v3-sdk";
import config from "../config/config.js";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = config.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async (to, subject, text, html) => {
  try {
    const result = await apiInstance.sendTransacEmail({
      sender: {
        name: "Saarthi",
        email: config.GOOGLE_USER,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      textContent: text,
      htmlContent: html,
    });

    console.log("Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Brevo Error:", error.response?.body || error);
    throw error;
  }
};