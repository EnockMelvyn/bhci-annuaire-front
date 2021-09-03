import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/model/contact';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss']
})
export class FormContactComponent implements OnInit {

  contactToUpdate: Contact = {}
  formContact : FormGroup
  constructor(private formBuilder: FormBuilder, private contactService: ContactService) { 
    
    console.log(this.contactToUpdate)
    this.formContact= this.formBuilder.group({
      idContact: [this.contactToUpdate.id],
      direction : [this.contactToUpdate.direction, Validators.required],
      nom: ["test", Validators.required],
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

  public updateContact(idContact: number): void{
    this.composeContact()
    this.contactService.updateContact(this.formContact.get('idContact')?.value,this.contactToUpdate ).subscribe(
      (response: Contact) => {
        this.contactToUpdate = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
}
