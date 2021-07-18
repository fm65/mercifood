import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  form: any = {
    name: null,
    ingredient: null,
    note: null
  };

  isSuccessful = false;
  errorMessage = '';
  isAddedFailed = false;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, ingredient, note} = this.form;
    this.recipeService.add(name, ingredient, note).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isAddedFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isAddedFailed = true;
      }
    )


  }

  reloadPage(): void {
    window.location.reload();
  }

}
