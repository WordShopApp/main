import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';

@Injectable()
export class CognitoService {
  providerLoginMap = {
    google: 'accounts.google.com',
    facebook: 'graph.facebook.com'
  };
  region = 'us-east-1';
  userIdentityPool = 'us-east-1:4fc54d30-cfa8-44d2-8ef8-338a206e1cba';
  fetchDelay = 250;

  constructor () { }

  signup (email, password): Promise<any>  {
    return new Promise((resolve, reject) => {
      let cisp = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18',
        region: 'us-east-1'
      });
      let params = {
        ClientId: 'p1pqjbdpguigb9j0c5rf13lgd',
        Password: password,
        Username: email
      };
      cisp.signUp(params, function(err, data) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  login (email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      let poolData = {
        UserPoolId: 'us-east-1_hpfNn6ALh',
        ClientId: 'p1pqjbdpguigb9j0c5rf13lgd'
    };

    let userPool = new AWSCognito.CognitoUserPool(poolData);
    let authData = {
        Username: email,
        Password: password
    };

    let authDetails = new AWSCognito.AuthenticationDetails(authData);
    let userData = {
        Username: email,
        Pool: userPool
    };

    let cognitoUser = new AWSCognito.CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
        onSuccess: function(result) {
            resolve({success: true, data: result});
        },
        onFailure: function(err) {
            reject(err);
        }
    });
    });
  }

  fetchCredentials (authProvider, authToken) {
    return new Promise((resolve, reject) => {
      this.clearCredentialCache();
      AWS.config.region = this.region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.userIdentityPool,
        Logins: this.loginsMap(authProvider, authToken)
      });
      AWS.config.credentials['get']((err) => {
        if (err) return reject(err);
        setTimeout(() => resolve(this.awsCreds()), this.fetchDelay);
      });
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
    logins[this.providerLoginMap[authProvider]] = authToken;
    return logins;
  }

}
