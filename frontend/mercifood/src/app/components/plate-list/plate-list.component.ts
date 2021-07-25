import { Component, OnInit } from '@angular/core';
import { PlateService } from 'src/app/services/plate.service';
import { PlateProps } from '../../../../../../backend/api/mercifood/models/plate.model';


@Component({
  selector: 'app-plate-list',
  templateUrl: './plate-list.component.html',
  styleUrls: ['./plate-list.component.scss']
})
export class PlateListComponent implements OnInit {

  plates?: PlateProps[];
  currentPlate: any = {};
  currentIndex = -1;
  name = '';


  constructor(private plateService: PlateService) { }

  ngOnInit(): void {
    this.retrievePlates();
  }

  retrievePlates(): void {
    this.plateService.getAll()
      .subscribe(
        data => {
          this.plates = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrievePlates();
    this.currentPlate = {};
    this.currentIndex = -1;
  }

  setActivePlate(plate: PlateProps, index: number): void {
    this.currentPlate = plate;
    this.currentIndex = index;
  }

  removeAllPlates(): void {
    this.plateService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchName(): void {
    this.currentPlate = {};
    this.currentIndex = -1;

    this.plateService.getBy(this.name)
      .subscribe(
        data => {
          this.plates = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

}
