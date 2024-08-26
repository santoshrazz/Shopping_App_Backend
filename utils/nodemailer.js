import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';
async function sendEmail(userEmail, messageParams) {
    try {
        let config = {
            service: "gmail",
            auth: {
                user: `santoshrajbgp11@gmail.com`,
                pass: process.env.gmail_app_password
            }
        }
        const transporter = nodemailer.createTransport(config);


        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Mailgen',
                link: 'https://mailgen.js/'
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });

        var email = {
            body: {
                name: messageParams.name,
                intro: 'Welcome to Geeks Shopping We\'re very excited to have you on board.',
                action: {
                    instructions: 'To get started with Geeks Shopping, please click here:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: messageParams.OTP,
                        link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        var emailBody = mailGenerator.generate(email);

        let message = {
            from: "santoshrajbgp11@gmail.com",
            to: userEmail,
            subject: "Verify your account",
            html: emailBody
        }
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        console.log(`info object is`, info);
    } catch (error) {
        console.log(`Error in sending email`, error.message);
    }
}
export default sendEmail