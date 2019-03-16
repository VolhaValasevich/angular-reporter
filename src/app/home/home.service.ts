import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class HttpService{
  
    constructor(private http: HttpClient){ }
      /*
    getData():Observable<User[]>{
        return this.http.get<User[]>("http://localhost:52460/api/users")
}*/
    public getJSON(): Observable<any> {
        return this.http.get("./assets/report.json");
    }
}