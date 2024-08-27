import bcryptjs from 'bcryptjs'
import crypto from 'crypto'


import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail,sendPasswordResetEmail,sendResetSuccessEmail } from '../mailtrap/emails.js';
import {User} from '../models/user.model.js'


export const signup = async(req,res) => {
  try {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    const userAlreadyExists = await User.findOne({email});
    if (userAlreadyExists) {
      return res.status(400).json({success : false, message: 'User Already Exits'})
    }

    const hashedPassword = await bcryptjs.hash(password,10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000 // 24 hrs
    })

    await user.save();
    console.log(user);

    // jwt
    generateTokenAndSetCookie(res,user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success:true,
      message: 'User created successfully',
      user: {
        ...user._doc,
        password: undefined
      }
    })

  } catch(error) {
    res.status(400).json({success : false,message : error.message});
  }
  
}

export const verifyEmail = async(req,res) => {
  const {code} = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt : { $gt : Date.now() },
    })

    if (!user) {
      return res.status(400).json({success : false, message : 'Invalid or Expired Verification code'})
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user._doc,
        password: undefined
      }
    })
    
  } catch(error) {
    console.log('Error in verify email', error);
    res.status(500).json({success: false, message: 'server error'})
  }
}

export const login = async(req,res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});

    if (!user) {
      res.status(400).json({success: false, message: 'Invalid Credentials'});
    }

    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      res.status(400).json({success: false, message: 'Invalid Credentials'});
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Login Successfully',
      user : {
        ...user._doc,
        password: undefined
      }
    })
  } catch(error) {
    console.log('Error in login', error);
    res.status(400).json({success: false, message: error.message});
  }
}

export const forgotPassword = async(req,res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({success: false, message: 'Invalid Email or Email does not exist'})
    }

    // Generate reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send the reset password email
    await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Reset Password Link sent to your Email successfully',
    })
  } catch(error) {
    console.log('Error in forgot password :',error);
    res.status(400).json({success:false, message : error.message});
  }
}

export const resetPassword = async(req,res) => {
  const {token} = req.params;
  const {password} = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken : token,
      resetPasswordExpiresAt: {$gt : Date.now()}
    })

    if (!user) {
      res.status(400).json({success: false, message: 'Invalid Token or Reset Token Expired'});
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // send password reset success email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: 'Password Reset Successful'
    })

  } catch(error) {
    console.error('Error in reset password', error);
    res.status(400).json({success: false, message : error.message});
  }
}

export const logout = async(req,res) => {
  res.clearCookie("token");
  res.status(200).json({success: true, message: 'Logged out Successfully'})
}

export const checkAuth = async(req,res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).status({success: false, message: 'User not found'});

    res.status(200).json({success: true, user})
  } catch(error) {
    console.error('Error in checkAuth ', error);
    res.status(400).json({success: false, message: error.message});
  }
}