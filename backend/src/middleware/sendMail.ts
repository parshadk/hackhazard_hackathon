import { createTransport } from "nodemailer";

const sendMail = async (email:any, subject:any, data:any) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  if (!process.env.Gmail || !process.env.Password) {
    throw new Error('Missing email credentials!');
  }
  
  const html = 
  `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 2rem;
          }
          .card {
              background-color: white;
              border-radius: 0.75rem;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
              padding: 2rem;
              text-align: center;
          }
          .logo {
              color: #4B0082;
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 1rem;
          }
          h1 {
              color: #1e293b;
              font-size: 1.25rem;
              font-weight: 600;
              margin-bottom: 1.5rem;
          }
          p {
              color: #64748b;
              font-size: 1rem;
              line-height: 1.5;
              margin-bottom: 1.5rem;
          }
          .otp-container {
              margin: 2rem 0;
          }
          .otp {
              display: inline-block;
              background-color: #f5f3ff;
              color: #4B0082;
              font-size: 2.25rem;
              font-weight: 700;
              letter-spacing: 0.5rem;
              padding: 1rem 1.5rem;
              border-radius: 0.5rem;
              border: 1px solid #e9d5ff;
          }
          .footer {
              color: #94a3b8;
              font-size: 0.875rem;
              margin-top: 2rem;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="card">
              <div class="logo">EduFinance</div>
              <h1>Verify Your Account</h1>
              <p>Hello ${data.name}, please use the following One-Time Password (OTP) to verify your account:</p>
              
              <div class="otp-container">
                  <div class="otp">${data.otp}</div>
              </div>
              
              <p>This OTP is valid for 10 minutes. Please don't share it with anyone.</p>
              
              <div class="footer">
                  <p>If you didn't request this, please ignore this email.</p>
                  <p>© ${new Date().getFullYear()} EduFinance. All rights reserved.</p>
              </div>
          </div>
      </div>
  </body>
  </html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export const sendForgotMail = async (subject:any, data:any) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = 
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
      }
      .card {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
        padding: 2rem;
      }
      .logo {
        color: #4B0082;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      h1 {
        color: #1e293b;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      p {
        color: #64748b;
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 1.5rem;
      }
      .button {
        display: inline-block;
        background-color: #4B0082;
        color: white;
        font-weight: 500;
        text-align: center;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        margin: 1rem 0;
      }
      .button:hover {
        background-color: #3a0068;
      }
      .divider {
        height: 1px;
        background-color: #e2e8f0;
        margin: 1.5rem 0;
      }
      .footer {
        color: #94a3b8;
        font-size: 0.875rem;
        text-align: center;
        margin-top: 2rem;
      }
      .warning {
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 1rem;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="logo">EduFinance</div>
        <h1>Reset Your Password</h1>
        <p>Hello, we received a request to reset your EduFinance account password.</p>
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        
        <a href="${process.env.frontendurl}/reset-password?token=${data.token}" class="button">
          Reset Password
        </a>
        
        <div class="divider"></div>
        
        <p class="warning">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} EduFinance. All rights reserved.</p>
          <p>Our mailing address is: support@edufinance.com</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};

export default sendMail;