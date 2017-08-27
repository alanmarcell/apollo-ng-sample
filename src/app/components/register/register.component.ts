import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, AuthUserArgs } from '../../models/user';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Input() user: User;
  newUser = false;
  errors: any;
  myForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationService: AuthService) {
    this.myForm = fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      displayName: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.newUser = true;
    this.user = new User();
  }

  authenticateUser() {
    this.user.userNameOrEmail = this.user.email || this.user.userName;

    const authUserArgs: AuthUserArgs = {
      userNameOrEmail: this.user.userNameOrEmail,
      password: this.user.password
    }

    this.authenticationService
      .authenticateUser(authUserArgs)
      .subscribe(error => this.errors = error);
  }


  saveUser() {
    this.userService
      .save(this.user)
      .subscribe(
      value => null,
      error => {
        this.errors = error
        console.log(error)
      },
      () => this.authenticateUser())
  }
}
