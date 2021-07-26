import { Component, OnInit } from '@angular/core';
import { PlateService } from 'src/app/services/plate.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { PlateProps } from '../../../../../../backend/api/mercifood/models/plate.model';

const ADMIN = 1;

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
  isAdmin = false;
  currentUser: any;
  isPlateFromCurrentUser = false;
  message = '';

  constructor(private plateService: PlateService,
              private token: TokenStorageService) { }

  ngOnInit(): void {
    this.retrievePlates();
    this.currentUser = this.token.getUser();
    if (this.currentUser == ADMIN){
      this.isAdmin = true;
    }
  }

  retrievePlates(): void {
    this.plateService.getAll()
      .subscribe(
        data => {
          this.plates = data;
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
    this.message = '';
    this.isPlateFromCurrentUser = false;
    if (this.currentPlate.User.id == this.currentUser.id) {
      this.isPlateFromCurrentUser = true;
    }
    console.log(this.currentPlate)
  }

  removePlate(by: any): void {
    this.plateService.delete(by)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'Le plat a été supprimé avec succès!';
          this.refreshList();
        },
        error => {
          console.log(error);
        });
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

  reservePlate(): void {
    this.message = '';
    this.currentPlate['reserved'] = true;

    this.plateService.update(this.currentPlate.id, this.currentPlate)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'Ce plat a été réservé avec succès!';
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }
}
