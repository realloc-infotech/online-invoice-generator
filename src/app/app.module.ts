import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { FilterPipe } from './pipe/filter.pipe';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateinvoiceComponent } from './pages/theme-pages/createinvoice/createinvoice.component';
import { ThmHeaderComponent } from './pages/theme/thm-header/thm-header.component';
import { ThmFooterComponent } from './pages/theme/thm-footer/thm-footer.component';
import { AppLandingpageComponent } from './pages/theme-pages/landingpage/landingpage.component';
import { PrivacypolicyComponent } from './pages/resources/privacypolicy/privacypolicy.component';
import { TermsofserviceComponent } from './pages/resources/termsofservice/termsofservice.component';

import { HelpPageComponent } from './pages/resources/help-page/help-page.component';
import { InvoicingGuideComponent } from './pages/resources/invoicing-guide/invoicing-guide.component';
import { GettingPaidComponent } from './pages/resources/invoicing-guide/getting-paid/getting-paid.component';
import { CreatingInvoicesComponent } from './pages/resources/invoicing-guide/creating-invoices/creating-invoices.component';
import { SendingInvoicesComponent } from './pages/resources/invoicing-guide/sending-invoices/sending-invoices.component';
import { BestPracticesComponent } from './pages/resources/invoicing-guide/best-practices/best-practices.component';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { BlogComponent } from './pages/theme-pages/blog/blog.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, '', '.json');
}

@NgModule({
  declarations: [AppComponent,
    BlankComponent,
    FilterPipe,
    ThmHeaderComponent,
    ThmFooterComponent,
    PrivacypolicyComponent,
    TermsofserviceComponent,
    HelpPageComponent,
    InvoicingGuideComponent,
    GettingPaidComponent,
    CreatingInvoicesComponent,
    SendingInvoicesComponent,
    BestPracticesComponent,
    BlogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgScrollbarModule,
    FullComponent,
    MatNativeDateModule
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
  providers : [DatePipe]
})
export class AppModule { }
