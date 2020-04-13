import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css']
})
export class ViewTransactionComponent implements OnInit {

  public selectedTransactionType: any;
  public viewTransactionForm: FormGroup;
  public isUserLoggedIn: boolean;
  public transactions: any;
  public transactionCodes: any;
  public transactionList: any;
  public columnDefs: any;
  public gridOptions: any;
  public userInfo: any;

  constructor(private router: Router, private cookieService: CookieService, private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isUserLoggedIn = false;
    if (localStorage.getItem('userInfo') !== undefined || localStorage.getItem('userInfo') !== null) {
      this.isUserLoggedIn = true;
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
    this.viewTransactionForm = new FormGroup({
      transactionType: new FormControl('', Validators.required),
      // transCode: new FormControl('', Validators.required),
    });
    this.gridOptions =  {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 8,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      suppressPropertyNamesCheck: true,
      suppressAutoSize: true,
      enableBrowserTooltips: true,
    };
    this.columnDefs = [
      {
          headerName: 'Transaction Id',
          field: 'transactionId',
          cellRenderer: data => {
            return '<a href="/view-by-id/' + data.value + '" target="_blank" routerLink="/view-by-id/' + data.value + '">' + data.value + '</a>';
          },
          editable: false,
          width: 210,
          tooltipField: 'Transaction Id'
      },
      {
          headerName: 'Transaction Type',
          field: 'transactionType',
          editable: false,
          width: 210,
          tooltipField: 'Transaction Type'
      },
      {
          headerName: 'Transaction Code',
          field: 'transCode',
          hide: true,
          editable: false,
          width: 210,
          tooltipField: 'Transaction Code'
      },
      {
          headerName: 'Department',
          field: 'department',
          editable: false,
          width: 210,
          tooltipField: 'Department'
      },
      {
          headerName: 'Section',
          field: 'section',
          editable: false,
          width: 210,
          tooltipField: 'Section'
      },
      {
          headerName: 'Status',
          field: 'statusFlag',
          editable: false,
          width: 210,
          tooltipField: 'Status'
      },
    ];
    this.transactionList = [];
    this.getAllData();
    this.getTransactionTypes();
  }

  public getTransactionTypes(): void {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/transaction-type/get-all';
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Access-Control-Allow-Origin': '*',
        accessKey : 'string'
      }
    };
    const payload = {
      roleId: this.userInfo.roleId,
      sessionKey: this.userInfo.sessionKey,
      username: this.userInfo.username
    };
    this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
      (data: any) => {
        const response = data;
        try {
          if (response.status === 'SUCCESS') {
            this.transactions = response.data;
          }
        } catch (error) {
          console.log('error: ' + error);
        }
      }, error => {
        console.log(error);
      }
    );
  }

  public getTransactionType(transactionValue: any): void {
    if (transactionValue.value !== 'SELECT') {
      this.getTransactionCodes(transactionValue.value);
      this.selectedTransactionType = transactionValue.value;
      this.getAllData();
    }
  }

  public getTransactionCodes(transType): void {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/trans-code/get-all';
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Access-Control-Allow-Origin': '*',
        accessKey : 'string'
      }
    };
    const payload = {
      roleId: this.userInfo.roleId,
      sessionKey: this.userInfo.sessionKey,
      transactionType: transType.toUpperCase(),
      username: this.userInfo.username
    };
    this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
      (data: any) => {
        const response = data;
        try {
          if (response.status === 'SUCCESS') {
            this.transactionCodes = response.data;
          }
        } catch (error) {
          console.log('error: ' + error);
        }
      }, error => {
        console.log(error);
      }
    );
  }

  public getAllData() {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/reviewer/get-all-approved-transaction';
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Access-Control-Allow-Origin': '*',
        accessKey : 'string'
      }
    };
    const payload = {
      // transactionType: this.selectedTransactionType,
      roleId: this.userInfo.roleId,
      sessionKey: this.userInfo.sessionKey,
      username: this.userInfo.username
    };

    this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
      (data: any) => {
        const response = data;
        try {
          if (response.status === 'SUCCESS') {
            this.transactionList = response.data;
          } else {
            this.snackBar.open(response.response, 'OK', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
          }
        } catch (error) {
          console.log('error: ' + error);
          this.snackBar.open(response.response, 'OK', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
        }
      }, error => {
        console.log(error);
      }
    );
  }

}
