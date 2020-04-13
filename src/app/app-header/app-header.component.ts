import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @ViewChild('snavMenu') snavMenu: MatSidenav;
  @Input() public isUserLoggedIn: boolean;
  @Input() public userRole: any;
  @Input() public isMenuHidden?: boolean;
  public userInfo: any;

  public menu = [
    {
      label: 'Create',
      path: '/create',
      role: 'ANALYST'
    },
    {
      label: 'Submit',
      path: '/submit',
      role: 'ANALYST'
    },
    {
      label: 'View Transaction',
      path: '/viewalltransaction',
      role: 'ANALYST'
    },
    {
      label: 'Pending',
      path: '/pending',
      role: 'REVIEWER'
    },
    {
      label: 'View',
      path: '/view',
      role: 'REVIEWER'
    },
  ];

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    if (localStorage.getItem('userInfo') !== undefined || localStorage.getItem('userInfo') !== null) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
  }

  public toggleMenu() {
    this.snavMenu.toggle();
  }

  public logout() {

    localStorage.clear();
    this.router.navigate(['/']);
  }

 } 
