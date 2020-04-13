import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionComponent } from './transaction/transaction.component';
import { LoginComponent } from './login/login.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { PendingComponent } from './pending/pending.component';
import { SubmitTransactionComponent } from './submit-transaction/submit-transaction.component';
import { ViewAllTransactionComponent} from './view-all-transaction/view-all-transaction.component';

const routes: Routes = [
	{
		path: '',
		component: LoginComponent
	},
	{
		path: 'create',
		component: TransactionComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['ANALYST']
			}
		}
	},
	{
		path: 'submit',
		component: SubmitTransactionComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['ANALYST']
			}
		}
	},
	{
		path: 'viewalltransaction',
		component: ViewAllTransactionComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['ANALYST']
			}
		}
	},
	{
		path: 'pending',
		component: PendingComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['REVIEWER']
			}
		}
	},
	{
		path: 'view',
		component: ViewTransactionComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			permissions: {
				only: ['REVIEWER']
			}
		}
	},
	{
		path: 'edit/:transactionId',
		component: EditTransactionComponent,
		// canActivate: [NgxPermissionsGuard],
		// data: {
		// 	permissions: {
		// 		only: ['REVIEWER', 'ADMIN']
		// 	}
		// }
	},
	{
		path: 'view-by-id/:transactionId',
		component: EditTransactionComponent,
		// canActivate: [NgxPermissionsGuard],
		// data: {
		// 	permissions: {
		// 		only: ['REVIEWER', 'ADMIN']
		// 	}
		// }
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
