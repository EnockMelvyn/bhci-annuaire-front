import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/model/contact';
import { ContactService } from 'src/app/service/contact.service';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.scss']
})

export class AddContactFormComponent implements OnInit {

  colonnes= ["DIRECTIONS", "NOMS", "FONCTIONS", "POSTES","MATRICULES", "ORDRE"];
  dataSource: any;
  formUpload: FormGroup;
  file: File;
  
  loading : boolean= false
  contacts: Contact[] = []
  arrayBuffer: any;

  filename =''
  constructor(private contactService: ContactService, private formBuilder: FormBuilder) { 
    this.formUpload = this.formBuilder.group({
      fileUpload: []
    })
  }

  ngOnInit(): void {
    this.dataSource = null
    this.contacts = []
    this.formUpload.patchValue({
      fileUpload: ''
    });
  }

  onImport(){
    const reader = new FileReader();
    this.file = this.formUpload.get('fileUpload')?.value;
    
    reader.onload = (event) => {
      console.log("rentrer dans le reader")
      this.arrayBuffer = reader.result;
      const workBook = xlsx.read(this.arrayBuffer, { type: 'binary'}); 
      const sheetName = workBook.SheetNames[0]
      const worksheet = workBook.Sheets[sheetName]
      const jsonData = xlsx.utils.sheet_to_json(worksheet, {raw : true})
      console.log(jsonData)
      this.dataSource= new MatTableDataSource(jsonData)
    }
    reader.readAsBinaryString(this.file)
  
  }
  onFileChange (event: any) {
    try {
      if (event.target.files.length >0){
        console.log("file 1")
        this.file = event.target.files[0];
        this.formUpload.patchValue({
          fileUpload: this.file
        });
        this.formUpload.get('fileUpload')?.updateValueAndValidity()
      }
    } catch (error){
      alert(error);
    }
  }


  public uploadFile() {
    var message 
    const formData = new FormData()
    formData.append('file', this.formUpload.get('fileUpload')?.value)
    this.contactService.importContactsFromExcelFile(formData).subscribe(
      (response => {
        alert(response.message)
      }),
      (error => {
        alert(error.message)
      }
    )) 
    this.ngOnInit()
  }

  public creationListeContact(): void{
    for (var val of this.dataSource.data){
          this.contacts.push({
            "nom": val["NOMS"],
             "fonction": val["FONCTIONS"],
             "posteTel": val["POSTES"], 
             "matricule": val["MATRICULES"],
             "direction": val["DIRECTIONS"],
             "numOrdre": val["ORDRE"]
            }
            )
        }


  } 

  public createContact() {
    this.loading = true
    this.creationListeContact()
    this.contactService.createContactFromListe(this.contacts).subscribe(
      (response => {
        this.loading = false
        alert("Annuaire mis à jour")
        this.ngOnInit()
      }),
      (error => {
        alert(error.message)
      }
    )) 
  }
}
