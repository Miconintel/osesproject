const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// when creating a class the variable needed that will be supplied in the outside environment is made availabkle to be passed into the constructor when a new object is created.
// @8%*vnB84kq^%D6w
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName
    // this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Chinaza <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    console.log(process.NODE_ENV)
    // const prod = process.env.NODE_ENV.trim();
    if (process.env.NODE_ENV !== 'development') {
      console.log('transport created')
       const nm =  nodemailer.createTransport({
        // host: 'smtp.sendgrid.net',
        // port: 587,
        service: 'SendGrid',
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
      console.log(nm)
      return nm
    } else {
      console.log('transport created')
      const nm = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user:`${process.env.EMAIL_USERNAME}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      // console.log(nm)
      return nm
    }
  }

  async send(template, subject) {
    try {
      // render htm in pug template
      // this is to gernerate the html from a pugcode
      const html = pug.renderFile(
        `${__dirname}/../views/emails/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        }
      );

      // define emailoptions

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
        // html:
      };
      console.log('waiting to send')
      const sent = await this.newTransport().sendMail(mailOptions);
      console.log(sent)
     
    } catch (err) {
      // if (err.code === 'EPROTOCOL')
      //   throw new Error('this is from the email');
      // whenever you throw an error it is caught on the catch block as the try block runs, you can also throw the eroor there, which will now be caught on the next catch block.

      throw err;
    }
  }

  async sendWelcome() {
    await this.send('welcomeemail', 'welcome to OSESWORLD');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'your password reset token valid for 10minutes'
    );
  }
};

// const sendEmail = async (options) => {
//   try {
//     // create a transporter/ that is the email carrying the ail
//     // this is how to create  transporter with Gmail
//     // const transporter = nodemailer.createTransport({
//     //   service: 'Gmail',
//     //   auth: {
//     //     user: process.env.EMAIL_USERNAME,
//     //     password: process.env.EMAIL_PASSWORD,
//     //   },
//     //   // actiate less secure App option
//     // });
//     // the one up is for gmail here omes no gmail
//     // ///////////////////
//     // console.log(process.env.EMAIL_HOST);
//     // console.log(process.env.EMAIL_PORT);
//     // console.log(process.env.EMAIL_USERNAME);
//     // console.log(process.env.EMAIL_PASSWORD);

//     // const transporter = nodemailer.createTransport({
//     //   host: process.env.EMAIL_HOST,
//     //   port: process.env.EMAIL_PORT,
//     //   auth: {
//     //     user: process.env.EMAIL_USERNAME,
//     //     pass: process.env.EMAIL_PASSWORD,
//     //   },
//     // });
//     if (!transporter) {
//       throw new Error('there is no transporter');
//     }
//     // define email option

//     const mailOptions = {
//       from: 'naa <hello@naza.com>',
//       to: options.email,
//       subject: options.subject,
//       text: options.message,
//       // html:
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.log(`${err} from email send`);
//     throw err;
//   }
// };
