import { Component, OnInit } from '@angular/core';
import { PlateService } from 'src/app/services/plate.service';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.scss']
})
export class PlateComponent implements OnInit {

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
  isShareFailed = false;

  constructor(private registerService: PlateService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, quantity, comment, photo } = this.form;
    this.registerService.share(name, quantity, comment, photo).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isShareFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isShareFailed = true;
      }
    )


  }

  reloadPage(): void {
    window.location.reload();
  }
}
