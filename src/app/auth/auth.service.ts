import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: any; // variable of TimeOut timer
  private authStatusListener = new Subject<boolean>(); // user authentication status listener

  constructor(private http: HttpClient, private router: Router) {}
  rootURL = "/api";
  /*
   * Method which returns user's token.
   * used in posts.service.ts
   * */
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    accountType: string
  ) {
    const signupData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      accountType,
    };
    console.log(signupData);
    this.http
      .post(this.rootURL + "/v1/auth/register", signupData)
      .subscribe((response) => {
        this.router.navigate(["/login"]);
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{
        tokens: {
          access: { token: string; expires: Date };
          refresh: { token: string; expires: Date };
        };
      }>(this.rootURL + "/v1/auth/login", authData)
      .subscribe((response) => {
        const token = response.tokens.access.token;
        this.token = token;
        if (token) {
          const expiresDate = response.tokens.access.expires;
          this.setAuthTimer(3600);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const expirationDate = new Date(expiresDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }

  /**
   * Method which tries to authenticate user
   * if there is unexpired token in local storage
   * */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000); //ms
      this.authStatusListener.next(true);
    }
  }

  /**
   * Logout method. Before user is logged out
   * it first deletes token, then emits that
   * information through authStatusListener
   * and clears timeout timer
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    if (!this.token && !this.isAuthenticated) {
      this.clearAuthData();
      this.router.navigate(["/login"]);
    }
  }

  /**
   * Timer function to call logout method after 1h expires
   */
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /**
   * Private method used to store token in browsers local stroge.
   */
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }
  /**
   * Method to clear local storage.
   */
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  /**
   * Method which returns token,
   * token expiration date and users
   * bankAccountID from browser local storage.
   * */
  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");

    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
