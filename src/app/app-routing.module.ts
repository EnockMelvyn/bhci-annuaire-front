import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContactFormComponent } from './component/add-contact-form/add-contact-form.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ListContactComponent } from './component/list-contact/list-contact.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'contacts', component: ListContactComponent},
  { path: 'importAnnuaire', component: AddContactFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
