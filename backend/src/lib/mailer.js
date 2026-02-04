
const nodemailer = require('nodemailer');

const createTransport = async () => {
  // Configuración del transporte para un servicio SMTP real
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const sendEmail = async (options) => {
  const transporter = await createTransport();
  const info = await transporter.sendMail(options);

  console.log('Mensaje enviado: %s', info.messageId);
  // No hay URL de previsualización para servicios SMTP reales
};

module.exports = { sendEmail };
