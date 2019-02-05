import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// services
import { UserService } from '../../services/user.service';

// regex
import { Pattern } from '../../classes/patterns';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../../styles/center-column.style.scss'
  ]
})
export class ForgotPasswordComponent {
  error = false;
  enviado = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Pattern.getEmail())]);
  resetPasswordForm = new FormGroup({
    'email': this.emailFormControl
  });

  constructor(private userService: UserService) { }

  requestPassword(email: string) {
    if (this.resetPasswordForm.valid) {
      return this.userService.requestPassword(email)
        .then(response => {
          this.enviado = true;
          this.error = false;
        },
          error => {
            console.error(error.statusText);
            this.error = true;
            this.enviado = false;
          });
    } else {
      // validate all form fields
      Object.keys(this.resetPasswordForm.controls).forEach(field => {
        const control = this.resetPasswordForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
}
