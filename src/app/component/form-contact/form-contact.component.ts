import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from 'src/app/model/contact';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss']
})
export class FormContactComponent implements OnInit {

  contactToUpdate: Contact 
  formContact : FormGroup
  constructor(private formBuilder: FormBuilder, private contactService: ContactService,
    @Inject(MAT_DIALOG_DATA) public data: {contact: Contact}) { 
    this.contactToUpdate = data.contact
    console.log(this.contactToUpdate)
    this.formContact= this.formBuilder.group({
      idContact: [this.contactToUpdate.id],
      direction : [this.contactToUpdate.direction, Validators.required],
      nom: [this.contactToUpdate.nom, Validators.required],
      fonction: [this.contactToUpdate.fonction, Validators.required],
      posteTel: [this.contactToUpdate.posteTel, Validators.required],
      numOrdre:[this.contactToUpdate.numOrdre, Validators.required]
    })
  }

  ngOnInit(): void {
  }


  public composeContact():void {
    this.contactToUpdate = {
      'id' : this.formContact.get('idContact')?.value,
      'direction' : this.formContact.get('direction')?.value,
      'nom' : this.formContact.get('nom')?.value,
      'fonction' : this.formContact.get('fonction')?.value,
      'posteTel' : this.formContact.get('posteTel')?.value,
      'numOrdre' : this.formContact.get('numOrdre')?.value
    }
  }

  public updateContact(): void{
    this.composeContact()
    this.contactService.updateContact(this.formContact.get('idContact')?.value,this.contactToUpdate ).subscribe(
      (response: Contact) => {
        this.contactToUpdate = response;
        alert('Contact mis à jour')
        window.close()
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
}
