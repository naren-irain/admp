import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-transaction',
  templateUrl: './submit-transaction.component.html',
  styleUrls: ['./submit-transaction.component.css']
})
export class SubmitTransactionComponent implements OnInit {
  public selectedTransactionType: any;
  public submitTransactionForm: FormGroup;
  public isUserLoggedIn: boolean;
  public selectedItems: any;
  public gridApi: any;
  public columnDefs: any;
  public gridOptions: any;
  public userInfo: any;
  public transactions: any;
  public transactionCodes: any;
  public transactionList: any;

  constructor(private router: Router, private cookieService: CookieService, private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isUserLoggedIn = false;
    if (localStorage.getItem('userInfo') !== undefined || localStorage.getItem('userInfo') !== null) {
      this.isUserLoggedIn = true;
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
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
      rowSelection: 'multiple'
    };
    this.columnDefs = [
      {
          headerName: 'Transaction Id',
          field: 'transactionId',
          cellRenderer: data => {
            return '<a href="/edit/' + data.value + '" target="_blank" routerLink="/edit/' + data.value + '">' + data.value + '</a>';
          },
          editable: false,
          width: 210,
          tooltipField: 'Transaction Id',
          headerCheckboxSelection: true,
          checkboxSelection: true
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
    this.submitTransactionForm = new FormGroup({
      transactionType: new FormControl(''),
      // transCode: new FormControl('', Validators.required),
    });
    this.selectedItems = [];
    this.getTransactionTypes();
    this.getAllData();
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
      this.getTransactionCodes(transactionValue.value);
      this.selectedTransactionType = transactionValue.value;
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

  public getAllData() {
    /** http post request to send user information */
    const url = environment.API_SERVICES + '/analyst/get-draft';
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Access-Control-Allow-Origin': '*',
        accessKey : 'string'
      }
    };
    const payload = {
      transactionType: this.submitTransactionForm.value.transactionType,
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

  public onGridReady(event: any) {
    this.gridApi = event.api;
  }

  public onSelectionChanged(event: any) {
    this.selectedItems = event.api.getSelectedRows();
  }

  public submit() {
    // send selected items list in aPI
    if (this.selectedItems.length) {
      const transItemList = [];
      this.selectedItems.forEach(item => transItemList.push(item.transactionId));
      /** http post request to send user information */
      const url = environment.API_SERVICES + '/analyst/submit';
      const httpOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
          'Access-Control-Allow-Origin': '*',
          accessKey : 'string'
        }
      };
      const payload = {
        transactionIdList: transItemList,
        roleId: this.userInfo.roleId,
        sessionKey: this.userInfo.sessionKey,
        username: this.userInfo.username
      };
      this.http.post(url, JSON.stringify(payload), httpOptions).subscribe(
        (data: any) => {
          const response = data;
          try {
            if (response.status === 'SUCCESS') {
              this.getAllData();
              this.snackBar.open('Transactions Submitted successfully', '', {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000});
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

  public cancel() {
    this.selectedTransactionType = '';
    this.submitTransactionForm.controls.transactionType.setValue('');
    this.selectedItems = [];
    const rows = this.gridApi.getRenderedNodes();
    rows.forEach(node => {
      node.gridApi.deselectNode(node, false);
    });
  }

}
