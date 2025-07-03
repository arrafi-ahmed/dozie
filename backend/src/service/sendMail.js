const nodeMailer = require("nodemailer");
const CustomError = require("../model/CustomError");
const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;

const transporter = nodeMailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

const sendMail = async (to, subject, html) => {
    return transporter.sendMail({
        from: `Click Event <${SMTP_USER}>`,
        to,
        // bcc: '',
        subject,
        html,
    });
};

const sendMailWAttachment = (to, subject, text, pdf) => {
    const pdfBuffer = Buffer.from(pdf.output(), "binary");
    const mailOptions = {
        from: `Click Event <${SMTP_USER}>`,
        to,
        // bcc: '',
        subject,
        text,
        attachments: [
            {
                filename: "attachment.pdf",
                content: pdfBuffer,
            },
        ],
    };
    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendMail,
    sendMailWAttachment,
};
