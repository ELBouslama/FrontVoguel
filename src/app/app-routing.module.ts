import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"; // import module for routes handling
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

import { AuthGuard } from "./auth/auth-guard"; // component to check if user is authenticated before accessing to other assets
import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { HeaderSideMenuComponent } from "./header-side-menu/header-side-menu.component";

// we define components to be called upon activation of corresponding route
const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "/" },
];

/**
 * We define decorator. With this decorator
 * we are upgrading base class to be NgModule
 * by adding two more fields
 */

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard], //route guard to protect unathorized URL access to server resource
})
export class AppRoutingModule {}
