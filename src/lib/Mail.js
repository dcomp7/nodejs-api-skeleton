import nodemailer from "nodemailer";
//import { resolve } from "path";
//import exphbs from "express-handlebars";
//import nodemailerhbs from "nodemailer-express-handlebars";
import mailConfig from "../config/mail.js";
//import { send } from "process";

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    //this.configureTemplates();
  }

  send(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
