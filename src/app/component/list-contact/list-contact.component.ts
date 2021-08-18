import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/model/contact';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.scss']
})
export class ListContactComponent implements OnInit {
  @ViewChild(MatPaginator) paginator : MatPaginator;
  dataSource: MatTableDataSource<Contact> = new MatTableDataSource()
  colonnes= ['direction','nom', 'fonction', 'matricule','posteTel']

  contacts: Contact[] = [];

  constructor(private contactService : ContactService
    ) { }

  ngOnInit(): void {
    this.getAllContacts();
    console.log(this.contacts)
  }


  public getAllContacts(): void{
    this.contactService.getAllContacts().subscribe(
      (response: Contact[]) => {
        this.contacts = response ;
        this.dataSource = new MatTableDataSource(this.contacts);
        this.dataSource.paginator = this.paginator
        console.log(this.contacts)
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
