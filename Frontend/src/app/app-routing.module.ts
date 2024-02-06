import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlannerComponent } from './pages/planner/planner.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TripListComponent } from './pages/trip-list/trip-list.component';
import { TripFormComponent } from './pages/trip-form/trip-form.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { TripComponent } from './pages/trip/trip.component';
import { ActivityFormComponent } from './pages/activity-form/activity-form.component';
import { TripPublicListComponent } from './pages/trip-public-list/trip-public-list.component';
import { InviteFormComponent } from './components/invite-form/invite-form.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ErrorComponent } from './pages/error/error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'planner', component: PlannerComponent},
  { path: 'contact', component: ContactComponent, data: { scrollToTop: 'true' }},
  { path: 'trips/all', component: TripListComponent , canActivate: [AuthGuard]},
  { path: 'trips/add', component: TripFormComponent , canActivate: [AuthGuard]},
  { path: 'trip/:id', component: TripComponent,  canActivate: [AuthGuard]},
  { path: 'activity/add', component: ActivityFormComponent, canActivate: [AuthGuard]},
  { path: 'trips/public', component: TripPublicListComponent },
  { path: 'trips/invite', component: InviteFormComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent }
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
