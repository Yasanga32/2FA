export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verify</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }
    table, td { border-collapse: collapse; }
    .container {
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
    }
    .main-content { padding: 48px 30px 40px; }
    .button {
      background: #22D172;
      padding: 10px 0;
      color: #fff;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }
  </style>
</head>

<body>
  <table width="100%" bgcolor="#F6FAFB" align="center">
    <tr>
      <td align="center">
        <table class="container">
          <tr>
            <td class="main-content">
              <h2>Verify your email</h2>
              <p>
                You are just one step away to verify your account for this email:
                <strong>{{email}}</strong>
              </p>
              <p><strong>Use the OTP below:</strong></p>
              <p class="button">{{otp}}</p>
              <p>This OTP is valid for 24 hours.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;


export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      max-width: 500px;
      margin: 70px auto;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      background: #22D172;
      padding: 14px 0;
      color: #ffffff;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
      letter-spacing: 3px;
    }

    .footer-text {
      font-size: 13px;
      color: #555;
      margin-top: 20px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tr>
      <td align="center">
        <table class="container" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="main-content">
              <h2>Forgot your password?</h2>

              <p>
                We received a request to reset the password for your account:
                <strong>{{email}}</strong>
              </p>

              <p><strong>Use the OTP below to reset your password:</strong></p>

              <div class="button">{{otp}}</div>

              <p class="footer-text">
                This OTP is valid for <strong>15 minutes</strong>.
                If you didn’t request a password reset, please ignore this email.
              </p>

              <p class="footer-text">
                — The Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
