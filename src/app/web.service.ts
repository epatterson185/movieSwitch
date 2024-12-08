import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class WebService {
    pageSize: number = 3;

    constructor(private http: HttpClient) { }

    getMovies(page: number) {
        return this.http.get<any>(
            'http://localhost:5000/api/v1.0/movies?pn=' + page + '&ps=' + this.pageSize);
    }

    getBusiness(id: any) {
        return this.http.get<any>(
            'http://localhost:5000/api/v1.0/movies/' + id);
    }

    getReviews(id: any){
        return this.http.get<any>(
            'http://localhost:5000/api/v1.0/movies/' + id + '/reviews');
    }

    postReview(id: any, review: any) {
        let postData = new FormData();
        postData.append("username", review.username);
        postData.append("comment", review.comment);
        postData.append("stars", review.stars);
      
        return this.http.post<any>(
          'http://localhost:5000/api/v1.0/movies/' + id + '/reviews',
          postData
        );
      }
      
}
