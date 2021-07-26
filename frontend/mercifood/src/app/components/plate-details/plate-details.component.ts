import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlateService } from 'src/app/services/plate.service';
import { PlateProps } from '../../../../../../backend/api/mercifood/models/plate.model';

@Component({
  selector: 'app-plate-details',
  templateUrl: './plate-details.component.html',
  styleUrls: ['./plate-details.component.scss']
})
export class PlateDetailsComponent implements OnInit {

  currentPlate: PlateProps = {
    name: null,
    photo: null,
    quantity: null,
    number: null,
    comment: null,
    reserved: false
  };
  message = '';
  published = false;

  constructor(
    private plateService: PlateService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getPlate(this.route.snapshot.params.id);
  }

  getPlate(id: string): void {
    this.plateService.getBy(id)
      .subscribe(
        data => {
          this.currentPlate = data;
        },
        error => {
          console.log(error);
        });
  }

  updatePublished(status: boolean): void {
    const data = {
      name: this.currentPlate.name,
      photo: this.currentPlate.photo,
      quantity: this.currentPlate.quantity,
      number: this.currentPlate.number,
      comment: this.currentPlate.comment,
      reserved: this.currentPlate.reserved,
    };

    this.message = '';

    this.plateService.update(this.currentPlate.id, data)
      .subscribe(
        response => {
          this.published = status;
          console.log(response);
          this.message = response.message ? response.message : 'Le statut a été mis à jour avec succès!';
        },
        error => {
          console.log(error);
        });
  }

  updatePlate(): void {
    this.message = '';

    this.plateService.update(this.currentPlate.id, this.currentPlate)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'Ce plat a été mis à jour avec succès!';
        },
        error => {
          console.log(error);
        });
  }

  deletePlate(): void {
    this.plateService.delete(this.currentPlate.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/plates']);
        },
        error => {
          console.log(error);
        });
  }

}
