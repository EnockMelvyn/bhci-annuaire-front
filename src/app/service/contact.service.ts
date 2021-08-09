import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Contact } from '../model/contact';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiServerUrl = environment.apiBaseUrl
  constructor(private http: HttpClient) { }

  public getAllContacts(): Observable<Contact[]> {
    return this.http.get<any>(`${this.apiServerUrl}/api/contacts`);
  }
  
  public importContactsFromExcelFile(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/api/contacts/uploadExcel`, formData);
  }
}
