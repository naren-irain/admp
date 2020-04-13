import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public error: any;
  public users: any;

  constructor(
    public router: Router,
    public http: HttpClient,
    public cookieService: CookieService,
    private permissionsService: NgxPermissionsService
    ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('analyst', Validators.required),
      password: new FormControl('analyst@123', Validators.required),
    });
    this.userLoggedIn();
  }

  public login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      /** http post request to send user information */
      const url = environment.API_SERVICES + '/authenticate/login';
      const httpOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
          'Access-Control-Allow-Origin': '*',
          accessKey : 'string'
        }
      };
      const payload = {
          username: this.loginForm.value.username,
          password: this.loginForm.value.password
      };
      this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
        (data: any) => {
          const response = data;
          try {
            if (response.status === 'SUCCESS' && response.roleId !== '') {
              const roles = new Array<string>();
              response.roleName = response.roleId;
              if (response.roleId =='ANALYST') {
                response.roleName = 'Initiator';
              }
              

              roles.push(response.roleId);
              localStorage.setItem('userInfo', JSON.stringify(response));
              this.permissionsService.loadPermissions(roles);
              if (roles.includes('ANALYST')) {
                this.router.navigate(['/create']);
              } else if (roles.includes('REVIEWER')) {
                this.router.navigate(['/pending']);
              }
            } else {
              if (response.status === 'SUCCESS' && response.roleId !== '') {
                this.error = 'User is not allocated with any roles';
              } else {
                this.error = response.response;
              }
            }
          } catch (error) {
            console.log('error: ' + error);
          }
        }, error => {
          console.log(error);
        }
      );
    }
  }

  public userLoggedIn() {
    const userData = localStorage.getItem('userInfo') !== null ? JSON.parse(localStorage.getItem('userInfo')) : undefined ;
    if (userData !== undefined) {
        const roles = new Array<string>();
        roles.push(userData.roleId);
        this.permissionsService.loadPermissions(roles);
        if (roles.includes('ANALYST')) {
          this.router.navigate(['/create']);
        } else if (roles.includes('REVIEWER')) {
          this.router.navigate(['/pending']);
        }
    }
  }
}
