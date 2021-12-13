import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class DashService {
  private dashStatusListener = new Subject<{
    firstName: string;
    lastName: string;
    balance: number;
    accountType: string;
    accountId: string;
    transactions: any[];
  }>(); // objekat klase koja odasilje podatke svim zaint. stranama

  constructor(private http: HttpClient, private router: Router) {}
  rootURL = "/api";
  /*
    Function to fetch all related user data from server
    to show it on Dasboard (Home) page
    */
  getUserData() {
    const userData = {
      firstName: "",
      lastName: "",
      balance: 0,
      accountType: "",
      accountId: "",
      transactions: [],
    };
    this.http
      .get<{
        firstName: string;
        lastName: string;
        balance: number;
        accountId: string;
        accountType: string;
        transactions: [];
      }>(this.rootURL + "/v1/user/me")
      .subscribe((res) => {
        userData.firstName = res[0].firstName;
        userData.lastName = res[0].lastName;
        userData.balance = res[0].accounts[0].balance;
        userData.accountId = res[0].accounts[0].id;
        userData.accountType = res[0].accounts[0].accountType;
        userData.transactions = res[0].accounts[0].transactions;
        this.dashStatusListener.next(userData);
      });
  }

  makeDeposit(value: string, description: string) {
    const depositData = {
      value,
      description,
      issuer: "61b5e0d7181ed542a43fb302",
    };

    this.http
      .post(this.rootURL + "/v1/operation/deposit", depositData)
      .subscribe((response) => {
        window.location.reload();
        this.router.navigate(["/"]);
        console.log(response);
      });
  }

  makeWithdraw(value: string, description: string) {
    const withdrawData = {
      value,
      description,
    };

    this.http
      .post(this.rootURL + "/v1/operation/withdraw", withdrawData)
      .subscribe((response) => {
        window.location.reload();
        this.router.navigate(["/"]);
        console.log(response);
      });
  }
  makeTransfer(value: string, description: string, recipient: string) {
    const transferData = {
      value,
      description,
      recipient,
    };

    this.http
      .post(this.rootURL + "/v1/operation/transfer", transferData)
      .subscribe((response) => {
        window.location.reload();
        this.router.navigate(["/"]);
        console.log(response);
      });
  }

  getUserDataListener() {
    return this.dashStatusListener.asObservable();
  }

  /*
    Function for converting data from ISO8601 shape (from MySQL db)
    into dd-mm-yy format for frontend (transactions list table).
     */
  dateFromISO8601(isostr) {
    var parts = isostr.match(/\d+/g);
    let date = new Date(
      parts[0],
      parts[1] - 1,
      parts[2],
      parts[3],
      parts[4],
      parts[5]
    );

    let partialYearStr = date.getFullYear().toString().substring(2, 4);

    let day = date.getDate() + 1;
    let dayStr = day.toString();

    let month = date.getMonth() + 1;
    let monthStr = month.toString();

    if (day < 10) {
      dayStr = "0" + day;
    }

    if (month < 10) {
      monthStr = "0" + month;
    }
    return dayStr + "-" + monthStr + "-" + partialYearStr;
  }
}
