import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  currentUser: any;

  isSuccessful = false;
  errorMessage = '';
  isEditedFailed = false;

  constructor(private token: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onSubmit(): void {
    // const { firstname, lastname, username, email, password, photo, number, address, zipcode, city, cantEat, bio};
    this.userService.update(this.currentUser).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isEditedFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isEditedFailed = true;
      }
    )
  }

}

