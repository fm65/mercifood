import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardAdminComponent } from './components/board-admin/board-admin.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PlateListComponent } from './components/plate-list/plate-list.component';
import { AddPlateComponent } from './components/add-plate/add-plate.component';
import { PlateDetailsComponent } from './components/plate-details/plate-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RecipeComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    EditProfileComponent,
    PlateListComponent,
    AddPlateComponent,
    PlateDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
