import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ReservationProps } from '../../../../../../backend/api/mercifood/models/reservation.model';
import { UserProps } from '../../../../../../backend/api/mercifood/models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user: UserProps = {
    firstname: null,
    lastname : null,
    username : null,
    password : null,
    email    : null,
    photo   : null,
    number  : null,
    address : null,
    zipcode : null,
    city    : null,
    cantEat : null,
    bio     : null,
    role    : null,
    isAvailable:null
  };
  reservation: any;
  currentReservation: any;

  constructor(private userService: UserService,
              private reservationService: ReservationService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getReservation(this.route.snapshot.params.id);
  }

  getReservation(id: string): void {
    this.reservationService.getBy(id)
      .subscribe(
        data => {
          this.currentReservation = data;
          if (data.UserId !== undefined) {
            console.log("###UserId: ", data.UserId)
            this.showUser(data.UserId);
          }
        },
        error => {
          console.log(error);
      });
  }

  showUser(by: any): void {
    this.userService.getBy(by)
    .subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.log(error);
      });
  }
}
