import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlateService } from 'src/app/services/plate.service';
import { PlateProps } from '../../../../../../backend/api/mercifood/models/plate.model';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.scss']
})
export class PlateComponent implements OnInit {
  currentUser: any;
  plates: PlateProps[];

  constructor(private plateService: PlateService) { }

  ngOnInit(): void {
    this.plateService.getAll().subscribe(data => console.log(JSON.stringify(data)));
    // console.log(JSON.stringify(this.plates))
  }
}
