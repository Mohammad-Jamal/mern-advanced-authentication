import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };
  const transport = nodemailer.createTransport(config);
  let message = {
    from: `"Authentication" <${process.env.EMAIL}>`, // custom display name
    to: email,
    subject: "Verify your Email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  try {
    const info = await transport.sendMail(message);
    console.log("email sent successfully", info.response);
    return {
      success: true,
      messageID: info.messageId,
      verificationToken,
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    // throw new Error("Error sending verification email", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  let transport = nodemailer.createTransport(config);
  let message = {
    from: `"Authentication" <${process.env.EMAIL}>`,
    to: email,
    subject: "Reset Your Password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };
  try {
    const info = await transport.sendMail(message);
    console.log("reset password email sent successfully", info.response);
    return {
      success: true,
      messageID: info.messageId,
    };
  } catch (error) {
    console.error("Error in sending reset password email", error);
    throw new Error("Error in sending Reset Email", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  const transport = nodemailer.createTransport(config);

  let message = {
    from: `"Authentication" <${process.env.EMAIL}>`,
    to: email,
    subject: "Password has been reset Successfully",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    const info = await transport.sendMail(message);
    console.log("Password has been reset successfully", info.response);
    return {
      success: true,
      messageID: info.messageId,
    };
  } catch (error) {
    console.error("Error in sending Reset success email", error);
    throw new error("Error in sending Reset success email", error);
  }
};
