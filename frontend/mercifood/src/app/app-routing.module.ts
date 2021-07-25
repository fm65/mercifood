import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { AddPlateComponent } from './components/add-plate/add-plate.component';
import { PlateListComponent } from './components/plate-list/plate-list.component';
import { PlateDetailsComponent } from './components/plate-details/plate-details.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditPlateComponent } from './components/edit-plate/edit-plate.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: ProfileComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'editprofile', component: EditProfileComponent },
  { path: 'add-plate', component: AddPlateComponent },
  { path: 'plates', component: PlateListComponent },
  { path: 'plates/:id', component: PlateDetailsComponent },
  { path: 'editplate', component: EditPlateComponent },
  //{ path: 'admin', component: BoardAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
