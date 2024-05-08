import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';


interface apps {
  id: number;
  img: string;
  title: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-thm-header',
  templateUrl: './thm-header.component.html',
  styleUrls: ['./thm-header.component.scss']
})
export class ThmHeaderComponent {


  apps: apps[] = [
    {
      id: 2,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'How to Use',
      link: 'help',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Invoice Format',
      link: 'invoice-format-2',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'E-Invoicing',
      link: 'e-invoices',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'Invoice Templates',
      link: 'invoice-templates',
    },
    {
      id: 6,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'FIRC in India',
      link: 'firc-india',
    }
  ];

  quicklinks: quicklinks[] = [
    {
      id: 2,
      title: 'How to Use',
      link: '/help',
    },
    {
      id: 3,
      title: 'Invoice Format',
      link: 'invoice-format-2',
    },
    {
      id: 4,
      title: 'E-Invoicing',
      link: 'e-invoices',
    },
    {
      id: 5,
      title: 'Invoice Templates',
      link: 'invoice-templates',
    },
    {
      id: 6,
      title: 'FIRC in India',
      link: 'firc-india',
    },
  ];

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
  ){}

}
