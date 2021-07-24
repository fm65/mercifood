import { Component, OnInit } from '@angular/core';
import { PlateService } from 'src/app/services/plate.service';

@Component({
  selector: 'app-plate-share',
  templateUrl: './plate-share.component.html',
  styleUrls: ['./plate-share.component.scss']
})
export class PlateShareComponent implements OnInit {

  form: any = {
    name: null,
    quantity: null,
    comment: null,
    photo: null,
    number: null
  };
  // isLoggedIn = true;
  isSuccessful = false;
  errorMessage = '';
  isSharedFailed = false;

  constructor(private plateService: PlateService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, quantity, number, photo, comment} = this.form;
    this.plateService.share(name, quantity, number, comment, photo).subscribe(
      data => {
        this.isSuccessful = true;
        this.isSharedFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSharedFailed = true;
      }
    )

  }


  reloadPage(): void {
    window.location.reload();
  }
}
