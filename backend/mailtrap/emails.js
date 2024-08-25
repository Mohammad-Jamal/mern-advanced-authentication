import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify  your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log(`Email sent successfully : ${response}`);
    // console.log(`Email sent successfully`);
  } catch (error) {
    console.error("Error sending verification", error);

    throw new Error("Error sending verification email", error);
  }
};

export const sendWelcomeEmail = async(email, name) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to : recipient,
      template_uuid: "38d5a633-2d14-45f7-ad58-661f0e4d9819",
      template_variables:  {
        "company_info_name": "Origin Company",
        "name": name
      }

    })
    console.log('Email sent successfully', response);
  } catch(error) {
    console.error('Error sending Welcome email ',error );

    throw new Error('Error sending Welcome email ',error )
  }
}

export const sendPasswordResetEmail = async(email,resetURL) => {
  const recipient = [{email}];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject:' Reset Your Password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
      category: 'Password Reset'
    })

    console.log('Reset Password email sent successfully', response);
  } catch(error) {
    console.error('Error in sending reset email ', error);
    throw new Error('Error in sending Reset Email', error);
  }
}

export const sendResetSuccessEmail = async(email) => {
  const recipient = [{email}];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Password has been reset Successfully', 
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset Success'
    })

    console.log('Password has been reset successfully', response);
  } catch(error) {
    console.error('Error in sending Reset Success email ', error);
    throw new Error('Error in sending Reset Success email', error);
  }
}
