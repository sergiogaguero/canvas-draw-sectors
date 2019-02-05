// angular basics
import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';


// project basics
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../../classes/constants';


// MESSAGE DIALOG CONSTRUCTOR
@Component({
  selector: 'app-message-dialog',
  styleUrls: ['message-dialog.component.scss'],
  templateUrl: 'message-dialog.component.html'
})
export class MessageDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // get translations
    this.translate.get(this.data.title).subscribe((res: string) => {
      this.data.title = res;
    });
    this.translate.get(this.data.message).subscribe((res: string) => {
      this.data.message = res;
    });
  }


  // when you click cancel, the dialog should get closed
  onNoClick(): void {
    this.dialogRef.close();
  }
}

export function OpenMessageDialog(title: string, message: string, dialog: MatDialog): MatDialogRef<MessageDialog> {
  // open the dialog
  return dialog.open(MessageDialog, {
    width: Constants.dialogWidth,
    data: {
      title: title,
      message: message
    }
  });
}
