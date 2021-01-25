const UserModel = require("../models/user.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
  getAllUsers = async (req, res, next) => {
    let userList = await UserModel.find();
    if (!userList.length) {
      throw new HttpException(404, "Users not found");
    }

    userList = userList.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.send(userList);
  };

  getUserById = async (req, res, next) => {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
  };

  getUserByemail = async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.params.email });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
  };

  getUserByphone = async (req, res, next) => {
    const user = await UserModel.findOne({ phone: req.params.phone });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
  };

  getCurrentUser = async (req, res, next) => {
    const { password, ...userWithoutPassword } = req.currentUser;

    res.send(userWithoutPassword);
  };

  createUser = async (req, res, next) => {
    this.checkValidation(req);

    await this.hashPassword(req);

    const result = await UserModel.create(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    var e = req.body.email
    const user = await UserModel.findOne({ email: e});

    const secretKey = process.env.SECRET_JWT || "secret";
    const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
      expiresIn: "24h",
    });

    var finalData = {
      message: "User was created!",
      id: user.id,
      email: user.email
    }

    res.status(201).send({...finalData, token});
  };

  verifyemail = async (req, res, next) => {
    var email = req.body.email;
    let otp = Math.random().toFixed(6).substr(`-${6}`);

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "samplesample660@gmail.com",
        pass: "hello@sample660",
      },
    });

    var mailOptions = {
      from: "samplesample660@gmail.com",
      to: email,
      subject: "Email Verification from Finpeg",
      text: "YOUR OTP IS  :-  " + otp,
    };

    var info = transporter.sendMail(mailOptions);
    if (!info) {
      throw new HttpException(500, "Something went wrong");
    }

    console.log(otp, email);
    var obj = {
      otp: otp,
      message: "OTP sent to " + email,
    };
    res.status(201).send(obj);
  };

  updateUser = async (req, res, next) => {
    this.checkValidation(req);

    const {...restOfUpdates } = req.body;

    // do the update query and get the result
    // it can be partial edit

   
    const result = await UserModel.update(restOfUpdates, req.params.id);

    if(req.body.status === 0){
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "samplesample660@gmail.com",
          pass: "hello@sample660",
        },
      });
  
      var mailOptions = {
        from: "samplesample660@gmail.com",
        to: req.body.email,
        subject: "Account Blocked",
        text: "YOUR ACCOUNT HAS BEEN BLOCKED.",
      };
  
      var data = transporter.sendMail(mailOptions);
      if (!data) {
        throw new HttpException(500, "Something went wrong");
      }
  
    }
    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "User not found"
      : affectedRows && changedRows
      ? "User updated successfully"
      : "Updated faild";

    res.send({ message, info });
  };

  deleteUser = async (req, res, next) => {
    const result = await UserModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(404, "User not found");
    }
    res.send("User has been deleted");
  };

  userLogin = async (req, res, next) => {
    this.checkValidation(req);

    const { email, password: pass } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new HttpException(401, "Not a user, please Signup!!");
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new HttpException(401, "Incorrect password!");
    }

    // user matched!
    const secretKey = process.env.SECRET_JWT || "secret";
    const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
      expiresIn: "24h",
    });

    const { password, ...userWithoutPassword } = user;

    res.send({ ...userWithoutPassword, token });
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation faild", errors);
    }
  };

  // hash password if it exists
  hashPassword = async (req) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
  };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController();
