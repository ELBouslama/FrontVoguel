import { Component, OnInit, Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DashService } from "./dashboard.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
@Injectable()
export class DashboardComponent implements OnInit, OnDestroy {
  // Here, we will store retrieved user data form server
  user = {
    firstName: "",
    lastName: "",
    balance: 0,
    accountType: "",
    accountId: "",
    transactions: [],
  };

  //transactions table variables
  dataSource = [];
  columnsToDisplayEng = [
    "date",
    "description",
    "nature",
    "amount",
    "senderAccountNumber",
    "BalanceAfterTransaction",
  ];
  expandedElement: LastTransaction | null;

  isLoading = false;
  userIsAuthenticated = false;
  hasTransactions = false; // if there are no transactions for logged user, set a flag for front-end

  private authStatusSub: Subscription;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    public dashService: DashService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dashService.getUserData();
    this.userSub = this.dashService
      .getUserDataListener()
      .subscribe(
        (userData: {
          firstName: string;
          lastName: string;
          balance: number;
          accountType: string;
          accountId: string;
          transactions: any[];
        }) => {
          this.isLoading = false;
          this.user = userData;
          this.dataSource = this.user.transactions;
          if (this.dataSource.length > 0) {
            this.hasTransactions = true;
          }
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDeposit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.dashService.makeDeposit(form.value.montant, form.value.description);
  }
  onWithDraw(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.dashService.makeWithdraw(form.value.montant, form.value.description);
  }
  onTransfert(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.dashService.makeTransfer(
      form.value.montant,
      form.value.description,
      form.value.recipient
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

/*
 * Interface for accessing transaction fields
 */
export interface LastTransaction {
  date: string;
  dateKnjizenja: string;
  amount: number;
  paymentMethod: string;
  senderAccountNumber: number;
  receiverAccountNumber: number;
  description: string;
}

export interface ExchangeCurr {
  country: string;
  currency: string;
  selling: string;
  buying: string;
  average: string;
}
