const Email = require('email-templates');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
// 1. Configure the SMTP Transporter (Hostinger)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
//   secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Initialize the Email Client
const emailClient = new Email({
  message: {
    from: `"Rebeca Support" <${process.env.SMTP_USER_ALIAS || process.env.SMTP_USER}>`, // Use alias if provided, else fallback to SMTP_USER
  },
  send: true, // Set to true to actually send emails
  transport: transporter,
  views: {
    root: path.resolve('emails'), // Folder where your Pug templates live
    options: { extension: 'pug' }
  },
  // This ensures CSS works in Gmail
  juiceResources: {
    preserveImportant: true,
    webResources: { relativeTo: path.resolve('emails') }
  }
});

/**
 * Reusable send function
 * @param {string} template - The folder name (e.g., 'event-registration')
 * @param {string} to - Recipient email
 * @param {object} locals - Variables for the Pug template (name, eventName, etc.)
 */
const sendEmail = async (template, to, locals) => {
  try {
    await emailClient.send({
      template: template,
      message: { to: to },
      locals: locals,
    });
    console.log(`Email [${template}] sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending [${template}] email:`, error);
    throw error; // Rethrow to handle it in the route
  }
};

module.exports = sendEmail ;