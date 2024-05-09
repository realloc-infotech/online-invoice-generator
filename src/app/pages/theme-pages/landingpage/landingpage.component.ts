import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';

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

interface demos {
  id: number;
  name: string;
  url: string;
  imgSrc: string;
}

interface testimonials {
  id: number;
  name: string;
  subtext: string;
  imgSrc: string;
  desc: string;
  rating : number
}

interface features {
  id: number;
  icon: string;
  title: string;
  subtext: string;
}

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']

})
export class AppLandingpageComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller
  ) {}

  // scroll to demos
  gotoDemos() {
    this.scroller.scrollToAnchor('demos');
  }

  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'eCommerce App',
      subtitle: 'Buy a Product',
      link: '/apps/email/inbox',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-dd-mobile.svg',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      img: '/assets/images/svgs/icon-dd-lifebuoy.svg',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      img: '/assets/images/svgs/icon-dd-message-box.svg',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      img: '/assets/images/svgs/icon-dd-application.svg',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];
  testimonials: testimonials[] = [
    {
      id: 1,
      imgSrc: '../../../../assets/images/1.png',
      name: 'Jenny Wilson',
      subtext: 'Artist',
      desc : "Easy invoice Generator has been a game-changer for my small business. The platform is user-friendly, and invoices professional and accurate. I no longer have to worry about manual errors or wasting time creating invoices from scratch. Highly recommend!",
      rating : 3
    },
    {
      id: 2,
      imgSrc: '../../../../assets/images/2.png',
      name: 'Minshan Cui',
      subtext: 'Freelancer',
      desc : "As a freelancer, I appreciate the simplicity and efficiency of Easy invoice Generator. It has helped me streamline my invoicing process, allowing me to focus more on my work and less on administrative tasks. The customization options are a nice touch, too!",
      rating : 5
    },
    {
      id: 3,
      imgSrc: '../../../../assets/images/3.png',
      name: 'Eminson Mendoza',
      subtext: 'Services',
      desc : "I've tried several invoicing tools, but Easy invoice Generator stands out for its affordability . The website is easy to navigate, and the customer support is top-notch. I'm very satisfied with the service and would recommend it to any business owner or freelancer.",
      rating : 4
    },
  ];
  features: features[] = [
    {
      id: 1,
      icon: 'wand',
      title: '6 Theme Colors',
      subtext:
        'We have included 6 pre-defined Theme Colors with Elegant Admin.',
    },
    {
      id: 2,
      icon: 'shield-lock',
      title: 'Authguard',
      subtext:
        'AuthGuard is used to protect the routes from unauthorized access in angular..',
    },
    {
      id: 3,
      icon: 'archive',
      title: '80+ Page Templates',
      subtext: 'Yes, we have 6 demos & 80+ Pages per demo to make it easier.',
    },
    {
      id: 4,
      icon: 'adjustments',
      title: '50+ UI Components',
      subtext:
        'Almost 50+ UI Components being given with Krenoz Admin Pack.',
    }
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 2,
      title: 'Authentication Design',
      link: '/authentication/side-login',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    },
    {
      id: 5,
      title: 'Notes App',
      link: '/apps/notes',
    },
    {
      id: 6,
      title: 'Employee App',
      link: '/apps/employee',
    },
    {
      id: 7,
      title: 'Todo Application',
      link: '/apps/todo',
    },
    {
      id: 8,
      title: 'Treeview',
      link: '/theme-pages/treeview',
    },
  ];
}
