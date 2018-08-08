import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

@Injectable()
export class CognitoService {
  region = 'us-east-1';
  userPoolId = 'us-east-1_k0qjPXdf5';
  appClientId = 'e5rga197fhitemj2ffs5go1u2';
  fetchDelay = 250;

  constructor () { }

  join (email, password): Promise<any>  {
    return new Promise((resolve, reject) => {
      let attributes = [];
      let emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({
        Name : 'email',
        Value : email
      });
      attributes.push(emailAttribute);
      this.userPool().signUp(email, password, attributes, null, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  login (email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      let ad = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : email,
        Password : password,
      });
      this.cognitoUser(email).authenticateUser(ad, {
        onSuccess: (result) => {
          let idToken = result.getIdToken().getJwtToken();
          resolve(idToken);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  logout () {
    let up = this.userPool();
    const user = up.getCurrentUser();
    if (user) user.signOut();
  }

  changePassword (email, oldPassword, newPassword): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoUser(email).changePassword(oldPassword, newPassword, (err, res)  => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  forgotPassword (email): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoUser(email).forgotPassword({
        onSuccess: function (res) {
          resolve(res);
        },
        onFailure: function(err) {
          reject(err);
        }
      });
    });
  }

  resetPassword (email, newPassword, verificationCode): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoUser(email).confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve(true);
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }

  resendConfirmationEmail (email): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoUser(email).resendConfirmationCode((err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  // https://stackoverflow.com/a/46627024
  token (): Promise<any> {
    return new Promise((resolve, reject) => {
      let up = this.userPool();
      const user = up.getCurrentUser();
      if (user) {
        user.getSession(function(err, data) {
          if (err) {
            reject(err);
          } else {
            const session = data;
            const token = session.getIdToken().jwtToken;
            resolve(token);
          }
        });
      } else {
        resolve(null);
      }
    });
  }

  cognitoUser (email) {
    return new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: this.userPool()
    });
  }

  userPool () {
    return new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: this.userPoolId,
      ClientId: this.appClientId
    });
  }

  fetchCredentials (authProvider, authToken) {
    return new Promise((resolve, reject) => {
      this.clearCredentialCache();
      AWS.config.region = this.region;
      /*
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.userIdentityPool,
        Logins: this.loginsMap(authProvider, authToken)
      });
      AWS.config.credentials['get']((err) => {
        if (err) return reject(err);
        setTimeout(() => resolve(this.awsCreds()), this.fetchDelay);
      });
      */
    });
  }

  clearCredentialCache () {
    if (AWS.config.credentials && AWS.config.credentials['clearCachedId']) AWS.config.credentials['clearCachedId']();
  }

  awsCreds () {
    let accessKeyId = AWS.config.credentials.accessKeyId;
    let secretAccessKey = AWS.config.credentials.secretAccessKey;
    let sessionToken = AWS.config.credentials.sessionToken;
    let identityId = AWS.config.credentials['identityId'];

    if (!accessKeyId || !secretAccessKey || !sessionToken || !identityId) return null;

    return {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken,
      identityId: identityId
    };
  }

  loginsMap (authProvider, authToken) {
    let logins = {};
    return logins;
  }

}
