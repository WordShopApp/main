import { Injectable } from '@angular/core';

import * as AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

import { CognitoService } from '../cognito/cognito.service';
import { LoggerService } from '../logger/logger.service';

export class S3Options {
  Bucket: string;
  Key: string;
  Body: any;
  ContentType?: string;
  ACL? = 'public-read';
}

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor (
    private cognitoService: CognitoService,
    private loggerService: LoggerService
  ) { }

  s3Client () {
    return new AWS.S3({
      apiVersion: '2006-03-01',
      region: 'us-east-1'
    });
  }

  upload (opts: S3Options): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoService.refreshCredentials().then(creds => {
        this.s3Client().putObject(opts, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }).catch(reject);
    });
  }
}
