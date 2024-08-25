import nodemailer from 'nodemailer'
import mailgen from 'mailgen'
async function sendEmail(email, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: "santoshrajbgp11@gmail.com",
                pass: "nzrd vfpd juzl xzkt",
            },
        });


        // Setting Up mailgen config
        // Configure mailgen by setting a theme and your product info
        var mailGenerator = new mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Santosh Raaz',
                link: 'https://mailgen.js/'
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });

        var email = {
            body: {
                name: 'Santosh Raaz',
                intro: `${message.text} and ${message.OTP} is your otp`,
                action: {
                    instructions: 'Thank You for Joining Us',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Click to verify',
                        link: 'https://google.com'
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };

        // Generate an HTML email with the provided contents
        // var emailBody = mailGenerator.generate(email);
        var emailText = mailGenerator.generatePlaintext(email);
        console.log(email);
        var mailOptions = {
            from: 'santoshrajbgp11@gmail.com',
            to: email,
            subject: message.subject,
            text: emailText
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return "Email Send Successfully";
            }
        });




    } catch (error) {
        console.log(`Error in sending email`);
    }
}
export default sendEmail