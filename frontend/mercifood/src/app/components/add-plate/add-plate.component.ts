import { Component, OnInit } from '@angular/core';
import { PlateService } from 'src/app/services/plate.service';
import { PlateProps } from '../../../../../../backend/api/mercifood/models/plate.model';

@Component({
  selector: 'app-add-plate',
  templateUrl: './add-plate.component.html',
  styleUrls: ['./add-plate.component.scss']
})
export class AddPlateComponent implements OnInit {

  plate: PlateProps = {
    name: null,
    photo: null,
    quantity: null,
    number: null,
    comment: null,
    reserved: false
  };
  submitted = false;

  constructor(private plateService: PlateService) { }

  ngOnInit(): void {
  }

  savePlate(): void {
    const data = {
      name: this.plate.name,
      photo: this.plate.photo,
      quantity: this.plate.quantity,
      number: this.plate.number,
      comment: this.plate.comment,
      reserved: this.plate.reserved,
    };

    this.plateService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newPlate(): void {
    this.submitted = false;
    this.plate = {
      name: null,
      photo: null,
      quantity: null,
      number: null,
      comment: null,
      reserved: false
    };
  }

}
