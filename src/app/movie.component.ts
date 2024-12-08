import { Component } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from './web.service';

@Component({
    selector: 'movie',
    standalone: true,
    imports: [RouterOutlet, CommonModule, GoogleMapsModule, ReactiveFormsModule],
    providers: [DataService, WebService],
    templateUrl: './movie.component.html',
    styleUrl: './movie.component.css'
})
export class MovieComponent {
    movie_list: any;
    loremIpsum: any;
    movie_lat: any;
    movie_lng: any;
    map_options: google.maps.MapOptions = {};
    map_locations: any[] = [];
    temperature: any;
    weather: any;
    weatherIcon: any;
    weatherIconUrl: any;
    temperatureColour: any;
    reviewForm: any;
    review_list: any;


    constructor(public dataService: DataService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public authService: AuthService,
        private webService: WebService) { }

    ngOnInit() {
        this.reviewForm = this.formBuilder.group({
            username: ["", Validators.required],
            comment: ["", Validators.required],
            stars: 5
        });
        this.webService.getBusiness(this.route.snapshot.paramMap.get('id'))
            .subscribe((response) => {
                this.movie_list = [response];
                this.movie_lat = this.movie_list[0].location.coordinates[0];
                this.movie_lng = this.movie_list[0].location.coordinates[1];

                this.map_locations.push({
                    lat: this.movie_lat,
                    lng: this.movie_lng
                });

                this.map_options = {
                    mapId: "DEMO_MAP_ID",
                    center: {
                        lat: this.movie_lat,
                        lng: this.movie_lng
                    },
                    zoom: 13
                };

                this.dataService.getLoremIpsum(1)
                    .subscribe((response: any) => {
                        this.loremIpsum = response.text.slice(0, 400);
                    });

                this.dataService.getCurrentWeather(this.movie_lat, this.movie_lng)
                    .subscribe((response: any) => {
                        let weatherResponse = response['weather'][0]['description'];
                        this.temperature = Math.round(response['main']['temp']);
                        this.weather = weatherResponse[0].toUpperCase() +
                            weatherResponse.slice(1);
                        this.weatherIcon = response['weather'][0]['icon'];
                        this.weatherIconUrl = "https://openweathermap.org/img/wn/" +
                            this.weatherIcon + "@4x.png";
                        this.temperatureColour = this.dataService.getTemeperatureColour(
                            this.temperature);
                    });
            });
        this.webService.getReviews(this.route.snapshot.paramMap.get('id'))
            .subscribe((response) => {
                this.review_list = response;
            });
    }

    onSubmit() {
        this.webService.postReview(
            this.route.snapshot.paramMap.get('id'),
            this.reviewForm.value)
            .subscribe((response) => {
                this.reviewForm.reset();
                this.webService.getReviews(this.route.snapshot.paramMap.get('id'))
                    .subscribe((response) => {
                        this.review_list = response;
                    });
            });
    }

    isInvalid(control: any) {
        return this.reviewForm.controls[control].invalid &&
            this.reviewForm.controls[control].touched;
    }

    isUntouched() {
        return this.reviewForm.controls.username.pristine ||
            this.reviewForm.controls.comment.pristine;
    }

    isIncomplete() {
        return this.isInvalid('username') ||
            this.isInvalid('comment') ||
            this.isUntouched();
    }

}