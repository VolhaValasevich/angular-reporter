import { Component, OnInit } from '@angular/core';
import { HttpService} from './home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HttpService]
})
export class HomeComponent implements OnInit {

  constructor(private httpService: HttpService){}
  tests: any[];
  ngOnInit() {
    this.httpService.getJSON().subscribe(value => this.tests= value);
  }
}
