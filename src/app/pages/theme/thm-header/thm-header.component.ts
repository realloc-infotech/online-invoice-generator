import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';


interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
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
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Invoice Template',
      subtitle: 'Invoice Template',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'Credit Note Template',
      subtitle: 'Credit Note Template',
      link: '/apps/email/inbox',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Quote Template',
      subtitle: 'Quote Template',
      link: '/apps/invoice',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Purchase Order Template',
      subtitle: 'Purchase Order Template',
      link: '/apps/calendar',
    }
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Invoicing Guide',
      link: '',
    },
    {
      id: 2,
      title: 'How to Use',
      link: '',
    },
    {
      id: 3,
      title: 'Sign In',
      link: '',
    },
    {
      id: 4,
      title: 'Sign Up',
      link: '',
    },
    {
      id: 5,
      title: 'Release Notes',
      link: '',
    },
    {
      id: 6,
      title: 'Developer API',
      link: '',
    },
  ];

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
  ){}

}
