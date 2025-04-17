import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideBarMenuItemComponent } from '../../components/sideBarMenuItem/sideBarMenuItem.component';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule,
    RouterModule,
    SideBarMenuItemComponent
  ],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {

  public routes = routes[0].children?.filter( (route) => route.data); // filtrar todas las routes que tengan data

 }

