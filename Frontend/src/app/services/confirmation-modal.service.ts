import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmationModal(title: string, message: string) {
    return this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { title, message },
    }).afterClosed();
  }
}