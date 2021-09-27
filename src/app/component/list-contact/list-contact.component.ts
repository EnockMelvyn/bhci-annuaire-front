import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/model/contact';
import { ContactService } from 'src/app/service/contact.service';
import { FormContactComponent } from '../form-contact/form-contact.component';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.scss']
})
export class ListContactComponent implements OnInit {
  @ViewChild(MatPaginator) paginator : MatPaginator;
  dataSource: MatTableDataSource<Contact> = new MatTableDataSource()
  colonnesULP= ['direction','nom', 'fonction','posteTel']
  colonnesADMIN= ['numOrdre','direction','nom', 'fonction','posteTel','actions']

  contacts: Contact[] = [];

  constructor(private contactService : ContactService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.getAllContacts();
  }

  public openDialogUpdateContact(contactToUpdate:Contact): void {
    const dialogRef = this.dialog.open(FormContactComponent, {
      data: {contact: contactToUpdate }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed")
      this.getAllContacts();
    });
  }

  public openDialogCreateContact(contactToUpdate : Contact): void {
    const dialogRef = this.dialog.open(FormContactComponent, {
      data: {contact: contactToUpdate}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllContacts();
    });
  }
  
  public deleteContact(idContact: number): void{
    this.contactService.deleteContact(idContact).subscribe(
      (response: HttpResponse<string>) => {
        alert("Contact supprimé!!!")
        this.ngOnInit()
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
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
