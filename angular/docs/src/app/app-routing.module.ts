import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdkComponent } from './views/cdk/cdk.component';
import { ComponentsComponent } from './views/components/components.component';
import { HomeComponent } from './views/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'components', component: ComponentsComponent, children: [
      { path: '', loadChildren: () => import('./views/components/root').then(m => m.RootModule) },
      { path: 'button', loadChildren: () => import('./views/components/button').then(m => m.ButtonModule) },
      { path: 'ripple', loadChildren: () => import('./views/components/ripple').then(m => m.RippleModule) }
    ]
  },
  {
    path: 'cdk', component: CdkComponent, children: [
      { path: '', loadChildren: () => import('./views/cdk/root').then(m => m.RootModule) },
      { path: 'portal', loadChildren: () => import('./views/cdk/portal').then(m => m.PortalModule) },
    ]
  },
  {
    path: 'guide/changelog', loadChildren: () => import('./views/guide/changelog').then(m => m.ChangelogModule)
  },
  {
    path: 'guide/theming', loadChildren: () => import('./views/guide/theming').then(m => m.ThemingModule)
  },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollOffset: [0, 56],
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
