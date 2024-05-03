import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { CreateinvoiceComponent } from './pages/theme-pages/createinvoice/createinvoice.component';
import { AppLandingpageComponent } from './pages/theme-pages/landingpage/landingpage.component';
import { CookieService } from 'ngx-cookie-service';
import { TermsofserviceComponent } from './pages/resources/termsofservice/termsofservice.component';
import { PrivacypolicyComponent } from './pages/resources/privacypolicy/privacypolicy.component';
import { HelpPageComponent } from './pages/resources/help-page/help-page.component';
import { InvoicingGuideComponent } from './pages/resources/invoicing-guide/invoicing-guide.component';
import { GettingPaidComponent } from './pages/resources/invoicing-guide/getting-paid/getting-paid.component';
import { CreatingInvoicesComponent } from './pages/resources/invoicing-guide/creating-invoices/creating-invoices.component';
import { SendingInvoicesComponent } from './pages/resources/invoicing-guide/sending-invoices/sending-invoices.component';
import { BestPracticesComponent } from './pages/resources/invoicing-guide/best-practices/best-practices.component';
import { EInvoicesComponent } from './pages/resources/e-invoices/e-invoices.component';
import { FircReceiveForeignComponent } from './pages/resources/firc-receive-foreign/firc-receive-foreign.component';
import { InvoiceFormatComponent } from './pages/resources/invoice-format/invoice-format.component';
import { InvoiceTemplatesComponent } from './pages/resources/invoice-templates/invoice-templates.component';
import { BlogComponent } from './pages/theme-pages/blog/blog.component';


const routes: Routes = [

  {
    path: '',
    component: AppLandingpageComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'landingpage',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.module').then(
            (m) => m.LandingPageModule
          ),
      },
    ],
  },
  {
    path : 'createinvoice',
    component : CreateinvoiceComponent
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
  {
    path : 'terms',
    component :TermsofserviceComponent
  },
  {
    path : 'privacy',
    component :PrivacypolicyComponent
  },
  {
    path : 'help',
    component : HelpPageComponent
  },
  {
    path : 'guide',
    component : InvoicingGuideComponent
  },
  {
    path : 'guide/getting-paid',
    component : GettingPaidComponent
  },
  {
    path : 'guide/creating-invoices',
    component : CreatingInvoicesComponent
  },
  {
    path : 'guide/sending-invoices',
    component : SendingInvoicesComponent
  },
  {
    path : 'guide/best-practices',
    component : BestPracticesComponent
  },
  {
    path : 'invoice-format-2',
    component : InvoiceFormatComponent
  },
  {
    path : 'e-invoices',
    component : EInvoicesComponent
  },
  {
    path : 'invoice-templates',
    component : InvoiceTemplatesComponent
  },  
  {
    path : 'firc-india',
    component : FircReceiveForeignComponent
  },
  {
    path : 'blog',
    component : BlogComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [CookieService]

})
export class AppRoutingModule {}
