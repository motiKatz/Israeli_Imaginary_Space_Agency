// import { Injectable } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { NotificationType, NotificationDialog } from '../components/notification-dialog/notification-dialog';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class NotificationService {
//   constructor(private dialog: MatDialog) {}

//   show(message: string, title = 'Info', type: NotificationType = 'info') {
//     this.dialog.open(NotificationDialog, {
//       data: { title, message, type },
//       width: '400px',
//       disableClose: true,
//     });
//   }

//   success(message: string, title = 'Success') {
//     this.show(message, title, 'success');
//   }

//   error(message: string, title = 'Error') {
//     this.show(message, title, 'error');
//   }

//   info(message: string, title = 'Info') {
//     this.show(message, title, 'info');
//   }

//   warning(message: string, title = 'Warning') {
//     this.show(message, title, 'warning');
//   }

//     confirm(
//     message: string,
//     title = 'Confirm',
//     confirmText = 'Yes',
//     cancelText = 'No'
//   ): Observable<boolean> {
//     const dialogRef = this.dialog.open(NotificationDialog, {
//       data: { title, message, type: 'confirm', confirmText, cancelText },
//       width: '400px',
//       disableClose: true,
//     });

//     return dialogRef.afterClosed();
//   }
// }

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialog, NotificationType } from '../components/notification-dialog/notification-dialog';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  private showSnackBar(
    message: string,
    type: NotificationType,
    title?: string
  ) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['snackbar-success'], 
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };

    this.snackBar.open(title ? `${title}: ${message}` : message, 'Close', config);
  }

  success(message: string, title = 'Success') {
    this.showSnackBar(message, 'success');
  }

  error(message: string, title = 'Error') {
    this.showSnackBar(message, 'error');
  }

  info(message: string, title = 'Info') {
    this.showSnackBar(message, 'info');
  }

  warning(message: string, title = 'Warning') {
    this.showSnackBar(message, 'warning');
  }

  confirm(
    message: string,
    title = 'Confirm',
    confirmText = 'Yes',
    cancelText = 'No'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(NotificationDialog, {
      data: { title, message, type: 'confirm', confirmText, cancelText },
      width: '400px',
      disableClose: true,
    });

    return dialogRef.afterClosed();
  }
}

