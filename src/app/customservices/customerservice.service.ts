import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../customer';

@Injectable()
export class CustomerService {
    constructor(private http: HttpClient) { }

    getCustomers() {
        return this.http.get<any>('assets/data.json')
            .toPromise()
            .then(res => <Customer[]>res.data)
            .then(data => { return data;});
    }

    getCustomersFn(): Observable<any> {
      return this.http.get<any>('assets/data.json')
    }
}