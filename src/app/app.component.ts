import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { InvoiceService } from './pages/theme/service/invoice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('bottomToTop', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      transition('void => *', animate('1800ms ease-in')),
      transition('* => void', animate('1800ms ease-out'))
    ]),
  ]
})
export class AppComponent {

  
  isOpen = false;
  cookieExists:any;

  constructor(public translate: TranslateService, 
    private cookieService: CookieService,
  private invoiceService : InvoiceService) {
    translate.addLangs(['en', 'fr','es','de']);
    translate.setDefaultLang('en');

    this.cookieExists = this.cookieService.check('invoice') 
  }

  setCookies() {
    if(!this.cookieExists) {
      this.cookieService.set('invoice', 'name : "Manish Savaliya"');
      this.cookieExists = true;
      this.invoiceService.setData(this.cookieExists)
    }
  }

  getAnimationState() {
    return this.isOpen ? 'in' : 'out';
  }
}

