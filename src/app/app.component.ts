import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoviesComponent } from './movies.component';
import { NavComponent } from './nav.component';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MoviesComponent, NavComponent],
  providers: [DataService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bizFE';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.populateReviews();
  }
}
