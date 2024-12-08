import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { DataService } from './data.service';
import { WebService } from './web.service';

@Component({
  selector: 'movies',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  providers: [DataService, WebService],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {

  movies_list: any;
  page: number = 1;

  constructor(public dataService: DataService,
    private webService: WebService) { }

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    //this.movies_list = this.dataService.getMovies(this.page);
    this.webService.getMovies(this.page)
      .subscribe((response) => {
        this.movies_list = response;
      })
  }

  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;
      this.webService.getMovies(this.page)
      .subscribe((response) => {
        this.movies_list = response;
      })
    }
  }

  nextPage() {
    if (this.page < this.dataService.getLastPageNumber()) {
      this.page = this.page + 1;
      sessionStorage['page'] = this.page;
      this.webService.getMovies(this.page)
      .subscribe((response) => {
        this.movies_list = response;
      })
    }
  }
}