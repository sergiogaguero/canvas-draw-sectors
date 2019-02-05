import { Component, OnInit } from '@angular/core';
// Servicios
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reports.component.html',
  styleUrls: [
    './reports.component.scss',
    '../../styles/navigatorBar.style.scss',
  ]
})

export class ReportsComponent implements OnInit {


  menuVisibility: any = {
    '/reports/visitors': false
  };

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isUserLoggedIn()) {
      // get current user
      this.userService.getDetailUser(this.authService.getLoggedInUser()).subscribe(response => {
        const user = response[0];

        // check what links the user can see from the menu
        for (const menu in this.menuVisibility) {
          if (menu) {
            this.authService.isRoleAuthorized(user.role.name, menu).then(isAuthorized => {
              this.menuVisibility[menu.toString()] = isAuthorized;
            });
          }
        }
      });
    }
  }

}
