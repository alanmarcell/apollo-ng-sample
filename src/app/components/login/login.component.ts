import { Component, OnInit, Input } from '@angular/core';
import { AuthUserArgs } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @Input() user: AuthUserArgs;
  error: any;
  token: any;

  constructor(private authenticationService: AuthService) { }

  ngOnInit() { this.user = new AuthUserArgs(); }

  authenticate() {
    this.authenticationService
      .authenticateUser(this.user)
      .subscribe(error => this.error = error);
  }
}
