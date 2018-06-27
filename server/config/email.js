const path = require('path');
const nodemailer = require('nodemailer');
const Email = require('email-templates');

module.exports.send = (template, to, locals) => {

  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
  
      const email = new Email({
        message: {
          from: 'niftylettuce@gmail.com'
        },
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: account.user, // generated ethereal user
              pass: account.pass // generated ethereal password
          }
        },
        views: {
          root: path.join(__dirname, 'emails'),
          options: {
            extension: 'hbs'
          }
        }
      });
      
      email.send({
        template: template,
        message: {
          to: to
        },
        locals: locals
      })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
    });
  }); 
}