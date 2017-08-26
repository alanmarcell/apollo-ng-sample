import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @Input() user: User;
  error: any;
  token: any;

  constructor(private authenticationService: AuthService) { }

  ngOnInit() { this.user = new User(); }

  authenticate() {
    this.authenticationService
      .authenticateUser(this.user)
      .subscribe(error => this.error = error);
  }
}
