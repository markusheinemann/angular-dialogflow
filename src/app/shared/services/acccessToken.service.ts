import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { sha256 } from 'js-sha256';
import * as moment from 'moment';
import { environment } from "src/environments/environment";
@Injectable()
export class AccessTokenSerivce {

  constructor(private httpClient: HttpClient) { }

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  public generateAccessToken() {
    // urn:ietf:params:oauth:grant-type:jwt-bearer
    console.log(this.generateJWT())
    return this.httpClient.post('https://oauth2.googleapis.com/token', {
      access_type: 'offline',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-beare',
      assertion: this.generateJWT(),
    }, this.options);
  }

  private generateJWT() {
    let header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    let claimSet = btoa(JSON.stringify({
      iss: environment.DF_ISS,
      scope: 'https://www.googleapis.com/auth/dialogflow',
      aud: 'https://oauth2.googleapis.com/token',
      exp: moment().add(1, 'hours').unix(),
      iat: moment().unix(),
    }));

    let plainSignature = header + '.' + claimSet;
    let signature = btoa(sha256.hmac(environment.DF_PUBLIC_KEY, plainSignature));

    return plainSignature + '.' + signature;
  }

}
