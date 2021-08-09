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

  colonnes= ["DIRECTIONS", "NOMS", "FONCTIONS", "POSTES","MATRICULES"];
  dataSource: any;
  formUpload: FormGroup;
  file: File;
  
  arrayBuffer: any;

  filename =''
  constructor(private contactService: ContactService, private formBuilder: FormBuilder) { 
    this.formUpload = this.formBuilder.group({
      fileUpload: []
    })
  }

  ngOnInit(): void {
  }

  onImport(){
    console.log("on import demarre")
    const reader = new FileReader();
    this.file = this.formUpload.get('fileUpload')?.value;
    console.log(this.file)
    
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
  
    console.log(" 1111111")
    console.log(this.file)
    console.log("22222222")
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
}
