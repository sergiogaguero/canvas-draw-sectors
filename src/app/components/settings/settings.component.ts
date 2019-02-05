// angular basics
import { Component, OnInit } from '@angular/core';

// services
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [
    './settings.component.scss',
    '../../styles/navigatorBar.style.scss',
  ]
})
export class SettingsComponent implements OnInit {

  menuVisibility: any = {
    '/settings/stores': false,
    '/settings/usuarios': false,
    '/settings/regions': false,
    '/settings/apis': false,
    '/settings/general': false,
    '/settings/status': false,
    '/settings/splash-page': false
  };

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // get current user
    this.userService.getDetailUser(this.authService.getLoggedInUser()).subscribe(response => {
      const user = response[0];

      // check what links the user can see from the menu
      for (const menu in this.menuVisibility) {
        if (menu) {
          this.authService.isRoleAuthorized(user.role.name, menu).then(response => {
            this.menuVisibility[menu.toString()] = response;
          });
        }
      }
    });
  }

}
