import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public selectedTransactionType: any;
  public transactionForm: FormGroup;
  public isUserLoggedIn: boolean;
  public userInfo: any;
  public transactions: any;
  public transactionCodes: any;
  public departments: any;
  public sections: any;
  public bankAccounts: any;
  public originalScenarios: any;
  public fkPortfolios: any;


  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isUserLoggedIn = false;
    if (localStorage.getItem('userInfo') !== undefined || localStorage.getItem('userInfo') !== null) {
      this.isUserLoggedIn = true;
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
    this.transactionForm = new FormGroup({
        transactionType: new FormControl('', Validators.required),
        transCode: new FormControl(''),
        department: new FormControl(''),
        section: new FormControl(''),
        cashTransferDetails: new FormGroup({
            accountIdFrom: new FormControl('', Validators.required),
            accountIdTo: new FormControl('', Validators.required),
            tradeDate: new FormControl('', Validators.required),
            paymentDate: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
            exchangeRate: new FormControl('', Validators.required),
            originalScenario: new FormControl('', Validators.required),
            fkSubPortfolioFrom: new FormControl('', Validators.required),
            fkSubPortfolioTo: new FormControl('', Validators.required),
            crossQc: new FormControl('', Validators.required),
            swiftGeneration: new FormControl('', Validators.required),
            freeComment: new FormControl(''),
        }),
        paymentDetails: new FormGroup({
            accountId: new FormControl('', Validators.required),
            transactionCode: new FormControl('', Validators.required),
            tradeDate: new FormControl('', Validators.required),
            settlementAmount: new FormControl('', Validators.required),
            settlementDate: new FormControl('', Validators.required),
            exchangeRate: new FormControl('', Validators.required),
            amountPc: new FormControl('', Validators.required),
            originalScenario: new FormControl('', Validators.required),
            fkSubPortfolio: new FormControl('', Validators.required),
            crossQc: new FormControl('', Validators.required)
        }),
    });
    this.getTransactionTypes();
    this.getDepartments();
  }

  public getTransactionTypes(): void {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/transaction-type/get-active';
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
      this.selectedTransactionType = transactionValue.value;
      this.getTransactionCodes(transactionValue.value);
      this.getBankAccounts();
      this.getOrgScenarios();
      this.getfkPortfolios();
    }
  }

  public getTransactionCodes(transType): void {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/trans-code/get-active';
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

  public getDepartments(): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/department/get-active';
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
             this.departments = response.data;
           }
         } catch (error) {
           console.log('error: ' + error);
         }
       }, error => {
         console.log(error);
       }
     );
  }

  public getBankAccounts(): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/bank-account/get-active';
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
             this.bankAccounts = response.data;
           }
         } catch (error) {
           console.log('error: ' + error);
         }
       }, error => {
         console.log(error);
       }
     );
  }

  public getOrgScenarios(): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/original-scenario/get-active';
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
             this.originalScenarios = response.data;
           }
         } catch (error) {
           console.log('error: ' + error);
         }
       }, error => {
         console.log(error);
       }
     );
  }

  public getfkPortfolios(): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/fk-portfolio/get-active';
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
             this.fkPortfolios = response.data;
           }
         } catch (error) {
           console.log('error: ' + error);
         }
       }, error => {
         console.log(error);
       }
     );
  }

  public getDepartment(department: any): void {
    if (department.value !== 'SELECT') {
      this.getSections(department.value);
    }
  }

  public getSections(departmentName): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/section/get-active';
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
       deptName: departmentName,
       username: this.userInfo.username
     };
     this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
       (data: any) => {
         const response = data;
         try {
           if (response.status === 'SUCCESS') {
             this.sections = response.data;
           }
         } catch (error) {
           console.log('error: ' + error);
         }
       }, error => {
         console.log(error);
       }
     );
  }

  public dateFormat(event: any, formGroup: any, formControl: any) {
    const momentDate = new Date(event.value);
    const formattedDate = moment(momentDate).format('YYYY/MM/DD');
    return formattedDate;
  }

  public createTransaction() {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/analyst/create';
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Access-Control-Allow-Origin': '*',
        accessKey : 'string'
      }
    };
    const payload = this.transactionForm.value;
    payload.roleId = this.userInfo.roleId;
    payload.sessionKey = this.userInfo.sessionKey;
    payload.username = this.userInfo.username;

    this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
      (data: any) => {
        const response = data;
        try {
          if (response.status === 'SUCCESS') {
            this.snackBar.open('Transaction created successfully', 'OK', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
            this.transactionForm.reset();
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
