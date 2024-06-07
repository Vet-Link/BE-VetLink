const message = (username, url) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; }
        .container { width: 100%; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 50px auto; border-radius: 10px; }
        .header { text-align: center; padding: 10px; background-color: #4CAF50; color: white; border-top-left-radius: 10px; border-top-right-radius: 10px; }
        .content { padding: 20px; text-align: center; }
        .content h3 { color: #333333; }
        .content p { color: #666666; }
        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 10px; font-size: 12px; color: #999999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>VetLink</h2>
        </div>
        <div class="content">
            <h1>Verify Your Email Address</h1>
            <h3>Hello ${username}</h3>
            <p>Thank you for signing up with VetLink! Please click the button below to verify your email address:</p>
            <p>Click <a href="${url}">here</a> to verify your email.</p>
            <p>Thank you for registering for our services.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 VetLink. All rights reserved.</p>
            <p>If you have any questions, feel free to <a href="mailto:support@vetlink.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = message;