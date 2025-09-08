import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

// export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'confirm';


// export interface NotificationData {
//   title: string;
//   message: string;
//   type?: NotificationType;
// }

export interface NotificationData {
  title: string;
  message: string;
  type?: NotificationType;
  confirmText?: string; // טקסט לכפתור אישור
  cancelText?: string;  // טקסט לכפתור ביטול
}


@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.html',
  styleUrls: ['./notification-dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, CommonModule]
})
export class NotificationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationData
  ) {
    if (!data.type) data.type = 'info';
  }
}
