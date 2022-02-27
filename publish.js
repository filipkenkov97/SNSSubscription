'use strict';
const AWS = require('aws-sdk'); 
const config = require('./config.js');

const sns = new AWS.SNS();

module.exports.publish = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (typeof data.msg !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'SYSTEM: Couldn\'t add the message.',
    });
    return;
  }

  const params = {
    Message: data.msg,
    TopicArn: `arn:aws:sns:us-east-1:${config.awsAccountId}:Mentorship`,
  };

  sns.publish(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'SYSTEM: Couldn\'t add the message due an internal error. Please try again later.',
      });
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({ SYSTEM: 'Message sent.' }),
    };
    callback(null, response);
  });
};