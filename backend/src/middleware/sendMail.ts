import { createTransport } from "nodemailer";

export const sendMail = async (email:any, subject:any, data:any) => {
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
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #eef2ff;
      margin: 0;
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      max-width: 600px;
      width: 100%;
    }

    .card {
      background-color: white;
      border-radius: 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      padding: 2.5rem 2rem 2rem 2rem;
      position: relative;
      text-align: center;
    }

    .top-image {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 50px;
      height: 50px;
    }

    .logo {
      color: #4B0082;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }

    h1 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    p {
      color: #475569;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0.75rem 0;
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
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      border: 1px solid #ddd6fe;
    }

    .warning {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 1.5rem;
    }

    .footer {
      color: #94a3b8;
      font-size: 0.875rem;
      text-align: center;
      margin-top: 2rem;
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

      <p class="warning">If you didn't request this OTP, please ignore this email or contact support.</p>

      <div class="footer">
        <p>© ${new Date().getFullYear()} EduFinance. All rights reserved.</p>
        <p>support@edufinance.com</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #eef2ff;
      margin: 0;
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      max-width: 600px;
      width: 100%;
    }

    .card {
      background-color: white;
      border-radius: 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      padding: 2.5rem 2rem 2rem 2rem;
      position: relative;
      text-align: center;
    }

    .top-image {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 50px;
      height: 50px;
    }

    .logo {
      color: #4B0082;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }

    h1 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    p {
      color: #475569;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0.75rem 0;
    }

    .button {
      display: inline-block;
      background-color:#6600ba;
      color: white;
      font-weight: 500;
      text-align: center;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #3a0068;
    }

    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 2rem 0;
    }

    .footer {
      color: #94a3b8;
      font-size: 0.875rem;
      text-align: center;
      margin-top: 1.5rem;
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
      <p>Click the button below to reset your password. This link will expire shortly.</p>

      <a href="${process.env.frontendurl}/reset-password?token=${data.token}" style="color: white;" class="button">
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
</html>
`;


  await transport.sendMail({
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};