import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.css']
})
export class EditTransactionComponent implements OnInit {

  public viewMode: boolean;
  public selectedTransactionType: any;
  public selectedDepartment: any;
  public editTransactionForm: FormGroup;
  public isUserLoggedIn: boolean;
  public transactionId: number;
  public transactionData: any;
  public userInfo: any;
  public transactions: any;
  public transactionCodes: any;
  public departments: any;
  public sections: any;
  public bankAccounts: any;
  public originalScenarios: any;
  public fkPortfolios: any;


  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) {
    this.viewMode = false;
    this.activatedRoute.params.subscribe(params => {
      this.transactionId = params.transactionId;
      this.viewMode = location.href.includes('view-by-id') ? true : false;
    });
  }

  ngOnInit(): void {
    this.isUserLoggedIn = false;
    if (localStorage.getItem('userInfo') !== undefined || localStorage.getItem('userInfo') !== null) {
      this.isUserLoggedIn = true;
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
    this.editTransactionForm = new FormGroup({
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
    this.getTransactionData(this.transactionId);
    this.getTransactionTypes();
    this.getDepartments();
    this.getBankAccounts();
    this.getOrgScenarios();
    this.getfkPortfolios();
  }

  public getTransactionData(transId) {
    if (transId !== undefined) {
      /** http post request to send user information */
      const url = environment.API_SERVICES + '/' + this.userInfo.roleId.toLowerCase() + '/get-by-transaction-id';
      const httpOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
          'Access-Control-Allow-Origin': '*',
          accessKey : 'string'
        }
      };
      const payload = {
        transactionId: transId,
        roleId: this.userInfo.roleId,
        sessionKey: this.userInfo.sessionKey,
        username: this.userInfo.username
      };
      this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
        (data: any) => {
          const response = data;
          try {
            if (response.status === 'SUCCESS') {
              this.transactionData = response.data;
              this.editTransactionForm = new FormGroup({
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
              this.editTransactionForm = this.setFormData(this.editTransactionForm, this.transactionData);
              this.getAllData();
            } else {
              this.snackBar.open(response.response, 'OK', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
            }
          } catch (error) {
            this.snackBar.open(response.response, 'OK', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
          }
        }, error => {
          console.log(error);
        }
      );
      this.editTransactionForm = this.setFormData(this.editTransactionForm, this.transactionData);
    }
  }

  public setFormData(formGroup: any, formData: object) {
    if (formData !== undefined) {
     const keys = Object.keys(formData);
     for (const key of keys) {
       if (key === 'cashTransferDetails' || key === 'paymentDetails') {
         this.setFormData(formGroup.controls[key], formData[key]);
       } else {
          // tslint:disable-next-line:no-unused-expression
          formGroup.controls[key] !== undefined ? formGroup.controls[key].setValue(formData[key]) : '';
       }
     }
     return formGroup;
    }
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

  public getTransactionType(): void {
    this.selectedTransactionType = this.editTransactionForm.controls.transactionType.value;
    this.getTransactionCodes(this.editTransactionForm.controls.transactionType.value);
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

  public getDepartments(): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/department/get-all';
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

  public getDepartment(): void {
    this.selectedDepartment = this.editTransactionForm.controls.department.value;
    this.getSections(this.editTransactionForm.controls.department.value);
  }

  public getSections(departmentName): void {
     /** http post request to send user information */
     const url = environment.API_SERVICES + '/section/get-all';
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

  public getAllData() {
    this.getTransactionType();
    this.getDepartment();
  }

  public updateTransaction() {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/' + this.userInfo.roleId.toLowerCase() + '/edit';
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Access-Control-Allow-Origin': '*',
        accessKey : 'string'
      }
    };
    const payload = this.editTransactionForm.value;
    payload.transactionId  = this.transactionId;
    payload.roleId = this.userInfo.roleId;
    payload.sessionKey = this.userInfo.sessionKey;
    payload.username = this.userInfo.username;

    this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
      (data: any) => {
        const response = data;
        try {
          if (response.status === 'SUCCESS') {
            this.snackBar.open('Transaction updated successfully', '', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
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
