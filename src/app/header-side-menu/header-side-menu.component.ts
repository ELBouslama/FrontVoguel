

import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { DashService } from "../dashboard-component/dashboard.service";

@Component({
  selector: "app-header",
  templateUrl: "./header-side-menu.component.html",
  styleUrls: ["./header-side-menu.component.css"],
})
export class HeaderSideMenuComponent implements OnInit, OnDestroy {
  isLoading = false;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  private userSub: Subscription; // subscriber to cath asynchronous response from dashboard.service.ts
  user = {
    name: "",
    surname: "",
  };

  /**
   * Here we inject two services:
   * 1. authService - to check if user is authenticated
   * 2. dashService - If an user is authenticated, we load its full name from dashService
   *
   */
  constructor(
    private authService: AuthService,
    public dashService: DashService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    const userId = this.authService.getUserId();
    this.dashService.getUserData();
    this.userSub = this.dashService
      .getUserDataListener()
      .subscribe((userData: { firstName: string; lastName: string }) => {
        this.isLoading = false;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
