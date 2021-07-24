import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { PlateShareComponent } from './components/plate-share/plate-share.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PlateComponent } from './components/plate/plate.component';
import { EditPlateComponent } from './components/edit-plate/edit-plate.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: ProfileComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'editprofile', component: EditProfileComponent },
  { path: 'plates', component: PlateComponent },
  { path: 'plateshare', component: PlateShareComponent },
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
