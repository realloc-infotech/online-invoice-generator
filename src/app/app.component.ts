import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { InvoiceService } from './pages/theme/service/invoice.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  cookieExists: any;

  constructor(public translate: TranslateService,
    private cookieService: CookieService,
    private router: Router,
    private invoiceService: InvoiceService) {
    // translate.addLangs(['en', 'fr', 'es', 'de']);
    // translate.setDefaultLang('en');
    // this.cookieExists = this.cookieService.check('invoice')
    this.cookieExists = this.cookieService.check('AcceptCookies')
    // Subscribe to the Router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Scroll to the top of the page when navigation ends
      window.scrollTo(0, 0);
    });


  }


  setCookies() {
    if (!this.cookieExists) {
      this.cookieExists = true;
      this.cookieService.set('AcceptCookies', JSON.stringify(this.cookieExists));
      this.invoiceService.setData(this.cookieExists)
    }
  }

  setCookiesColse() {
    this.cookieExists = false;
    this.cookieService.set('AcceptCookies', JSON.stringify(this.cookieExists));
    this.invoiceService.setData(this.cookieExists)
    this.cookieExists = true;
  }



  getAnimationState() {
    return this.isOpen ? 'in' : 'out';
  }
}

