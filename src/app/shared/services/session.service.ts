import { Injectable } from "@angular/core";
import * as uuid from "uuid";
@Injectable({
  providedIn: 'root'
})

export class SessionService {

  static getSessionToken() {
    let sessionId: string;

    if (localStorage.getItem('sessionID')) {
      sessionId = localStorage.getItem('sessionId');
    } else {
      sessionId = uuid.v4();
      localStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
  }
}
