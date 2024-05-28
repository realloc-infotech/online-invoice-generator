import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, UntypedFormArray, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../theme/service/invoice.service';
import { CookieService } from 'ngx-cookie-service';
import "jspdf-autotable";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
class Product {
  name: string;
  price: number = 0;
  qty: number = 0;
  discount: number = 0;
  total: number
}
class Invoice {
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  billTo: string;
  billToEmail: string;
  billToAddress: String;
  billToContact: string;
  products: Product[] = [];
  customerToGST : string ;
  customerFormGST : string ;
  additionalDetails: string;

  constructor() {
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}

@Component({
  selector: 'app-createinvoice',
  templateUrl: './createinvoice.component.html',
  styleUrls: ['./createinvoice.component.scss']
})

export class CreateinvoiceComponent {
  addForm: UntypedFormGroup | any;
  rows: UntypedFormArray;

  invoices = new Invoice();

  ///////////////////////////////////////////////////////////
  subTotal = 0;
  vat = 0;
  grandTotal = 0;
  termsList: any =''

  notesList: any = ''
  iscurrencyName: any = ''
  isInvoiceId : boolean = false
  invoiceId :any =  1
  text: string = "Sub Total"; // Input text
  formGSTName: any = "GST";
  toGSTName: any = "GST";
  discount: any = "Discount"; // Input text
  shipping: any = "Shipping";
  mainTitle: any = "INVOICE";
  gst: any = "Gst";
  terms: any = "Terms and conditions";
  notes: any = "Notes";
  isEditing: boolean = false;
  isDiscount: boolean = false;
  isShipping: boolean = false;
  isFormGst: boolean = false;
  isToGst: boolean = false;
  isGst: boolean = false;
  isTerms: boolean = false;
  isNotes: boolean = false;
  isTitle: boolean = false;
  invoiceLogo: string | ArrayBuffer | null = null;
  isvisibleButton: boolean = false
  isvisibleShippingButton: boolean = false
  isvisibleTaxButton: boolean = false
  totalDiscount: any = 0
  totalShipping: any = 0
  taxRate: any = 0
  currencyList: any = []
  invoiceDate : Date  = new Date();
  totalTextData: any = []
  isInvoiceThemeColor : any
  invoiceThemeColorList : any = [
    {
      colorCode : '#000'
    },
    {
      colorCode : '#1b476a'
    },
    {
      colorCode : '#28a352'
    },
    {
      colorCode : '#f2ac33'
    },
    {
      colorCode : '#fc7734'
    },
    {
      colorCode : '#9051ba'
    },
    {
      colorCode : '#be348a'
    },
    {
      colorCode : '#ca2e55'
    },
    {
      colorCode : '#5ed0aa'
    },
    {
      colorCode : '#5d87ff'
    },
  ] 
  selectedCurrency: string;
  filteredCurrencies: string[];
  selectedDiscountType :any = 'percentage'
  isShowFormGst : boolean = true
  isShowToGst : boolean = true
  selectedInvoiceTheme : any 
  invoiceThemeList: any = [
    { name: 'Invoice 1', imageUrl: '../../../../assets/images/invoice/1/invoice_page_1.jpg', value: 1 },
    { name: 'Invoice 2', imageUrl: '../../../../assets/images/invoice/2/invoice_page_2.jpg' , value: 2 },
  ] 
  

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private invoiceService :InvoiceService,
    private cookieService :CookieService,
    private router: Router,
    private http: HttpClient,
    // public dialogRef: MatDialogRef<CreateinvoiceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.filteredCurrencies = this.currencyList;
      this.selectedInvoiceTheme = 1
      this.termsList = `Maintain strict confidentiality of invoices, prohibiting sharing with unauthorized parties.

Define conditions for invoice cancellation or modification, including associated fees.`

      this.notesList = `Make invoices clear with details like invoice number, date, and product/service breakdown.

Keep a professional tone with consistent formatting, proper grammar, and suitable language.`

      this.isInvoiceThemeColor = this.invoiceThemeColorList[0].colorCode

    this.addForm = this.fb.group({});

    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());

    this.http.get<any>('../../../../assets/currency/Currency.json').subscribe(
      data => {
        this.currencyList = data
        this.iscurrencyName = this.getsymbol(this.currencyList.INR)
      
      },
      error => {
        console.log('Error fetching JSON data:', error);
      }
    );

    if(Boolean(this.cookieService.get('AcceptCookies')) === true){
      const invoiceItem :any = localStorage.getItem('invoice');
      const value = JSON.parse(invoiceItem);

      if(value) {
        this.invoiceLogo = value?.logoUrl
        this.mainTitle = value?.title
        this.invoiceId = value?.id + 1
        this.invoices.email = value?.emailId
        this.invoices.address = value?.fromAddress
        this.invoices.contactNo = value?.contactNo
        this.invoices.customerName = value?.billFrom
        this.termsList = value?.termsConditions
        this.notesList = value?.notes
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  onAddRow(): void {
    this.rows.push(this.createItemFormGroup());
  }

  closeImg() {
    this.invoiceLogo = ''
  }

  onRemoveRow(rowIndex: number): void {
    const totalCostOfItem =
      this.addForm.get('rows')?.value[rowIndex].unitPrice *
      this.addForm.get('rows')?.value[rowIndex].units;

    this.subTotal = this.subTotal - totalCostOfItem;
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): UntypedFormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      units: ['', Validators.required],
      unitPrice: ['', Validators.required],
      itemTotal: ['0'],
    });
  }

  itemsChanged(): void {
    let total: number = 0;
    // tslint:disable-next-line - Disables all
    for (let t = 0; t < (<UntypedFormArray>this.addForm.get('rows')).length; t++) {
      if (
        this.addForm.get('rows')?.value[t].unitPrice !== '' &&
        this.addForm.get('rows')?.value[t].units
      ) {
        total =
          this.addForm.get('rows')?.value[t].unitPrice * this.addForm.get('rows')?.value[t].units +
          total;
      }
    }
    this.subTotal = total;
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
  }
  ////////////////////////////////////////////////////////////////////

  invoice :any = ''

  generatePDF(action = 'open') {
    this.totalTextData = []
    this.totalTextData.push(
      { text: `${this.text}       :   `, bold: true , lineHeight: 1.3 },
      `${this.iscurrencyName.split(" ")[1]}${this.calculateSubTotal()}` + '\n',
    )
    if (this.isvisibleButton) {
      this.totalTextData.push(
        { text: `${this.discount}        :   `, bold: true , lineHeight: 1.3 },
        `${this.totalDiscount}${this.selectedDiscountType === 'percentage' ? '%' : '₹'}` + '\n',
      )
    }

    if (this.isvisibleShippingButton) {
      this.totalTextData.push(
        { text: `${this.shipping}        :   `, bold: true , lineHeight: 1.3 },
        `${this.iscurrencyName.split(" ")[1]}${this.totalShipping}` + '\n',
      )
    }

    if (this.isvisibleTaxButton) {
      this.totalTextData.push(
        { text: `${this.gst}                  :   `, bold: true , lineHeight: 1.3 },
        `${this.taxRate}%` + '\n',
      )
    }

    this.totalTextData.push(
      { text: "Grand Total    :   ", bold: true , lineHeight: 1.3 },
      `${this.iscurrencyName.split(" ")[1]}${this.grandTotalNumer()}` + '\n',
    )

      

    // Calculate the number of empty rows needed to make the total rows equal to five
    const emptyRowCount = Math.max(5 - this.invoices.products.length, 0);

    // Create an array to hold the empty rows
    const emptyRows = Array(emptyRowCount).fill({
      name: '',
      price: '',
      qty: '',
      discount: ''
    });

    // Merge the products array with the empty rows
    const allProducts = [...this.invoices.products, ...emptyRows];

    // Generate rows for the table with background color applied to alternate rows and bottom border for the last row
    const tableRows: any = allProducts.map((p, index, array) => {
      const isLastRow = index === array.length - 1; // Check if it's the last row
      // const rowColor = index % 2 === 0 ? '#e5e5e5' : '#ffff'; // Apply background color to alternate rows
      const bottomBorder = isLastRow ? [true, false, true, true] : [true, false, true, false]; // Set bottom border for the last row
      return [
        { text: p.name, fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3] },
        { text: p.price, fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3], alignment: 'center' },
        { text: p.qty, fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3], alignment: 'center' },
        { text: p.price ? this.calculateTotalPrice(p.price, p.qty, p.discount) : "" , fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3], alignment: 'center' }
      ];
    });


    // Update the table body with the generated rows
    const tableBody = [
      [
        { text: 'Product', style: 'tableHeader', border: [true, true, true, true] },
        { text: 'Price', style: 'tableHeader', border: [true, true, true, true] },
        { text: 'Quantity', style: 'tableHeader', border: [true, true, true, true] },
        { text: 'Amount', style: 'tableHeader', border: [true, true, true, true] }
      ],
      ...tableRows
    ];


    let docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 10, 40, 10], // [left, top, right, bottom]
      background: function (currentPage: any) {
        const padding = -10;
        const lineColor = '#000'
        return {
          canvas: [
            // Left margin line
            {
              type: 'line',
              x1: 40 + padding, // Left margin + padding
              y1: 60 + padding, // Top margin + padding
              x2: 40 + padding, // Left margin + padding
              y2: 781.89 - padding, // 841.89 - Bottom margin - padding
              lineColor: lineColor // Set line color
            },
            // Top margin line
            {
              type: 'line',
              x1: 40 + padding, // Left margin + padding
              y1: 60 + padding, // Top margin + padding
              x2: 555.28 - padding, // A4 width - Right margin - padding
              y2: 60 + padding, // Top margin + padding
              lineColor: lineColor // Set line color
            },
            // Right margin line
            {
              type: 'line',
              x1: 555.28 - padding, // A4 width - Right margin - padding
              y1: 60 + padding, // Top margin + padding
              x2: 555.28 - padding, // A4 width - Right margin - padding
              y2: 781.89 - padding, // 841.89 - Bottom margin - padding
              lineColor: lineColor // Set line color
            },
            // Bottom margin line
            {
              type: 'line',
              x1: 40 + padding, // Left margin + padding
              y1: 781.89 - padding, // 841.89 - Bottom margin - padding
              x2: 555.28 - padding, // A4 width - Right margin - padding
              y2: 781.89 - padding, // 841.89 - Bottom margin - padding
              lineColor: lineColor // Set line color
            }
          ]
        };
      },
      content: [
        {
          image: this.invoiceLogo,
          width: '*', // Set the width to fill available content width
          fit: [90, 90], // Fit the image within 100x100 dimensions
          alignment: 'center',
          margin: [0, 50, 0, 10]
        },
        {
          columns: [
            [{
              text: this.mainTitle,
              fontSize: 20,
              bold: true,
              alignment: 'start',
              color: this.isInvoiceThemeColor,
              margin: [0, 0, 0, 20] // Add some space after the title
            },],
            [
              {
                text: '#' + this.invoiceId,
                fontSize: 16,
                bold: true,
                alignment: 'right',
                color: this.isInvoiceThemeColor,
                margin: [0, 0, 0, 10] // Add some space after the title
              },
              {
                text: this.formatDate(this.invoiceDate), // Add invoice date here
                fontSize: 13,
                alignment: 'right',
                margin: [0, 0, 0, 20] // Add some space after the invoice date
              }
            ],
          ]
        },
        {
          columns: [
            // Customer Details on the left
            {
              width: '*',
              alignment: 'left',
              margin: [0, 3, 0, 3],
              text: [
                { text: 'Shop Details\n', style: 'sectionHeader' ,lineHeight: 1.3},
                { text: this.invoices.customerName + '\n' , bold: true,  fontSize: 11, lineHeight: 1.3 },
                { text: this.invoices.email + '\n',  fontSize: 11, lineHeight: 1.3 },
                { text: this.invoices.contactNo + '\n',  fontSize: 11, lineHeight: 1.3 },
                { text: this.invoices.address + '\n',  fontSize: 11, lineHeight: 1.3 },
                ...(this.isShowFormGst ? [{ text: `${this.formGSTName} : `, bold: true, lineHeight: 1.3 }, `${this.invoices.customerFormGST}` + '\n'] : []),
              ]
            },
            // Bill Details on the right
            {
              width: '*',
              alignment: 'right',
              margin: [0, 3, 0, 3],
              text: [
                { text: 'Customer Details\n', style: 'sectionHeader' ,lineHeight: 1.3},
                { text: this.invoices.billTo + '\n',  bold: true,  fontSize: 11, lineHeight: 1.3 },
                { text: this.invoices.billToEmail  + '\n',  fontSize: 11, lineHeight: 1.3 },
                { text: this.invoices.billToContact  + '\n',  fontSize: 11, lineHeight: 1.3 },
                { text: this.invoices.billToAddress  + '\n',  fontSize: 11, lineHeight: 1.3 },
                ...(this.isShowToGst ? [{ text: `${this.formGSTName} : `, bold: true, lineHeight: 1.3 }, `${this.invoices.customerFormGST}` + '\n'] : []),
              ]
            }
          ],
          // margin: [0, 0, 0, 20] // Add space after the columns
        },
        {
          text: 'Product Details',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10] // Add space before and after the section
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: tableBody,
          }
        },
        {
          columns: [
              // Customer Details on the left
              {
                  width: '*',
                  alignment: 'left',
                  margin: [350, 10, 0, 0],
                  text: this.totalTextData
              }
          ]
      },
        {
          text: 'Terms',
          style: 'sectionHeader',
          margin: [0, 15, 0, 5] // Add space before and after the section
        },
        {
          ul: this.termsList.split('\n').filter((item: any) => item.trim() !== ''),
          margin: [0, 0, 0, 10] // Add space after the list
        },
        {
          text: 'Notes',
          style: 'sectionHeader',
          margin: [0, 0, 0, 5] // Add space before and after the section
        },
        {
          ul: this.notesList.split('\n').filter((item: any) => item.trim() !== '')
        },
        { text: 'Signature', alignment: 'right', margin: [50, 50] },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          color: this.isInvoiceThemeColor,
          margin: [0, 15, 0, 5] // Adjust top and bottom margins
        },
        tableHeader: {
          bold: false,
          fontSize: 12,
          fillColor: this.isInvoiceThemeColor,
          color: 'white',
          alignment: 'center',
          margin: [3, 3, 3, 3]
        }
      }
    };

    if (Boolean(this.cookieService.get('AcceptCookies')) === true) {
      const data :any = {
        logoUrl: this.invoiceLogo,
        title: this.mainTitle,
        id: this.invoiceId,
        billFrom: this.invoices.customerName,
        emailId: this.invoices.email,
        fromAddress: this.invoices.address,
        contactNo: this.invoices.contactNo,
        termsConditions: this.termsList,
        notes: this.notesList
      }

      // Store the data in localStorage
      localStorage.setItem('invoice', JSON.stringify(data));

    }

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download(`${this.invoiceId}/${this.invoices.billTo}`);
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }

  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  addProduct() {
    this.invoices.products.push(new Product());
    this.calculateSubTotal()
  }

  removeRow(rowIndex: any): void {
    this.invoices.products.splice(rowIndex, 1);
  }

  discountChange(i: any) {
    const discountValue = this.invoices.products[i].discount * (this.invoices.products[i].price * this.invoices.products[i].qty) / 100;
    this.invoices.products[i].total = (this.invoices.products[i].price * this.invoices.products[i].qty) - discountValue
    this.calculateSubTotal()
  }


  sendPdfWhatsapp() {
    this.totalTextData = []
    this.totalTextData.push(
      {
        text: `Sub Total: ${this.iscurrencyName.split(" ")[0]} ${this.calculateSubTotal()}/- \n`,
        bold: true,
        margin: [0, 5],
        lineHeight: 1.5
      },
    )
    if (this.isvisibleButton) {
      this.totalTextData.push(
        {
          text: `Discount: ${this.totalDiscount}% \n`,
          bold: true,
          margin: [0, 5],
          lineHeight: 1.5
        },
      )
    }

    if (this.isvisibleShippingButton) {
      this.totalTextData.push(
        {
          text: `Shipping: ${this.iscurrencyName.split(" ")[1]} ${this.totalShipping}/- \n`,
          bold: true,
          margin: [0, 5],
          lineHeight: 1.5
        },
      )
    }

    if (this.isvisibleTaxButton) {
      this.totalTextData.push(
        {
          text: `Tax: ${this.iscurrencyName.split(" ")[0]} ${this.taxRate}% \n`,
          bold: true,
          margin: [0, 5],
          lineHeight: 1.5
        },
      )
    }

    this.totalTextData.push(
      {
        text: `Grand Total: ${this.iscurrencyName.split(" ")[0]} ${this.grandTotalNumer()}/- \n`,
        bold: true,
        margin: [0, 5],
        lineHeight: 1.5
      },
    )
    


    // Calculate the number of empty rows needed to make the total rows equal to five
const emptyRowCount = Math.max(5 - this.invoices.products.length, 0);

// Create an array to hold the empty rows
const emptyRows = Array(emptyRowCount).fill({
  name: '',
  price: '',
  qty: '',
  discount: ''
});

// Merge the products array with the empty rows
const allProducts = [...this.invoices.products, ...emptyRows];

// Generate rows for the table with background color applied to alternate rows and bottom border for the last row
const tableRows: any = allProducts.map((p, index, array) => {
  const isLastRow = index === array.length - 1; // Check if it's the last row
  // const rowColor = index % 2 === 0 ? '#e5e5e5' : '#ffff'; // Apply background color to alternate rows
  const bottomBorder = isLastRow ? [true, false, true, true] : [true, false, true, false]; // Set bottom border for the last row
  return [
    { text: p.name, fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3] },
    { text: p.price, fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3], alignment: 'center' },
    { text: p.qty, fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3], alignment: 'center' },
    { text: p.price ?  this.calculateTotalPrice(p.price, p.qty, p.discount) : '', fillColor: '#eceff7', border: bottomBorder, margin: [0, 3, 0, 3], alignment: 'center' }
  ];
});


// Update the table body with the generated rows
const tableBody = [
  [
    { text: 'Product', style: 'tableHeader', border: [true, true, true, true] },
    { text: 'Price', style: 'tableHeader', border: [true, true, true, true] },
    { text: 'Quantity', style: 'tableHeader', border: [true, true, true, true] },
    { text: 'Amount', style: 'tableHeader', border: [true, true, true, true] }
  ],
  ...tableRows
];

    
    let docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 10, 40, 10], // [left, top, right, bottom]
      background: function (currentPage: any) {
        const padding = -10;
        const lineColor = '#000'
        return {
          canvas: [
            // Left margin line
            {
              type: 'line',
              x1: 40 + padding, // Left margin + padding
              y1: 60 + padding, // Top margin + padding
              x2: 40 + padding, // Left margin + padding
              y2: 781.89 - padding, // 841.89 - Bottom margin - padding
              lineColor: lineColor // Set line color
            },
            // Top margin line
            {
              type: 'line',
              x1: 40 + padding, // Left margin + padding
              y1: 60 + padding, // Top margin + padding
              x2: 555.28 - padding, // A4 width - Right margin - padding
              y2: 60 + padding, // Top margin + padding
              lineColor: lineColor // Set line color
            },
            // Right margin line
            {
              type: 'line',
              x1: 555.28 - padding, // A4 width - Right margin - padding
              y1: 60 + padding, // Top margin + padding
              x2: 555.28 - padding, // A4 width - Right margin - padding
              y2: 781.89 - padding, // 841.89 - Bottom margin - padding
              lineColor: lineColor // Set line color
            },
            // Bottom margin line
            {
              type: 'line',
              x1: 40 + padding, // Left margin + padding
              y1: 781.89 - padding, // 841.89 - Bottom margin - padding
              x2: 555.28 - padding, // A4 width - Right margin - padding
              y2: 781.89 - padding, // 841.89 - Bottom margin - padding
              lineColor: lineColor // Set line color
            }
          ]
        };
      },
      content: [
        {
          image: this.invoiceLogo,
          width: '*', // Set the width to fill available content width
          fit: [100, 100], // Fit the image within 100x100 dimensions
          alignment: 'center',
          margin: [0, 50, 0, 10]
        },
        {
          columns: [
            [{
              text: this.mainTitle,
              fontSize: 20,
              bold: true,
              alignment: 'start',
              color: this.isInvoiceThemeColor,
              margin: [0, 0, 0, 20] // Add some space after the title
            },],
            [
              {
                text: 'Invoice No' + this.invoiceId,
                fontSize: 16,
                bold: true,
                alignment: 'right',
                color: this.isInvoiceThemeColor,
                margin: [0, 0, 0, 10] // Add some space after the title
              },
              {
                text: this.formatDate(this.invoiceDate), // Add invoice date here
                fontSize: 14,
                alignment: 'right',
                margin: [0, 0, 0, 20] // Add some space after the invoice date
              }
            ],
          ]
        },
        {
          columns: [
            // Customer Details on the left
            {
              width: '*',
              alignment: 'left',
              text: [
                { text: 'Customer Details\n', bold: true, fontSize: 14, color: this.isInvoiceThemeColor },
                { text: '\n', margin: [0, 25, 0, 0] },
                { text: this.invoices.customerName + '\n', bold: true },
                this.invoices.email + '\n',
                this.invoices.contactNo + '\n',
                { text: this.invoices.address }
              ]
            },
            // Bill Details on the right
            {
              width: '*',
              alignment: 'right',
              text: [
                { text: 'Bill Details\n', bold: true, fontSize: 14, color: this.isInvoiceThemeColor },
                { text: '\n', margin: [0, 25, 0, 0] },
                { text: this.invoices.billTo + '\n', bold: true},
                this.invoices.billToEmail + '\n',
                this.invoices.billToContact + '\n',
                { text: this.invoices.billToAddress }
              ]
            }
          ]
          
          // margin: [0, 0, 0, 20] // Add space after the columns
        },
        {
          text: 'Product Details',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10] // Add space before and after the section
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: tableBody,
          }
        },
        // {
        //   margin: [0, 20, 0, 10],
        //   columns: [
        //     {
        //       width: '*',
        //       alignment: 'right',
        //       text: this.totalTextData
        //     }
        //   ],
        // },
        {
          columns: [
            // Customer Details on the left
            {
              width: '*',
              alignment: 'left',
              text: [
                { text: "Sub Total:" + '\n', bold: true },
                { text: "Discount:" + '\n', bold: true },
                { text: "Shipping:" + '\n', bold: true },
                { text: "Tax:" + '\n', bold: true },
                { text: "Grand Total:" + '\n', bold: true },
              ]
            },
            // Bill Details on the right
            {
              width: '*',
              alignment: 'left',
              text: [
                { text: 12.00 + '\n'},
                { text: 10 + '\n'},
                { text: 12 + '\n'},
                { text: 124 + '\n'},
                { text: 12.00 + '\n'},
              ]
            }
          ]
          
          // margin: [0, 0, 0, 20] // Add space after the columns
        },

        {
          text: 'Terms',
          style: 'sectionHeader',
          margin: [0, 15, 0, 5] // Add space before and after the section
        },
        {
          ul: this.termsList.split('\n').filter((item: any) => item.trim() !== ''),
          margin: [0, 0, 0, 10] // Add space after the list
        },
        {
          text: 'Notes',
          style: 'sectionHeader',
          margin: [0, 0, 0, 5] // Add space before and after the section
        },
        {
          ul: this.notesList.split('\n').filter((item: any) => item.trim() !== '')
        },
        { text: 'Signature', alignment: 'right', margin: [50, 50] },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          color: this.isInvoiceThemeColor,
          margin: [0, 15, 0, 5] // Adjust top and bottom margins
        },
        tableHeader: {
          bold: false,
          fontSize: 12,
          fillColor: this.isInvoiceThemeColor,
          color: 'white',
          alignment: 'center',
          margin: [3, 3, 3, 3]
        }
      }
    };
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBlob((blob: Blob) => {
      const whatsappUrl = window.URL.createObjectURL(blob);
      const message = encodeURIComponent(`Please open the link and upload the document: ${whatsappUrl}`);
      this.openWhatsAppChat(message);

    });

  }

  openWhatsAppChat(message: string) {
    const url = `https://web.whatsapp.com/send?phone=${this.invoices.billToContact}&text=${message}`;
    // Open WhatsApp chat window
    window.open(url, '_blank');
  }

  calculateTotalPrice(price: number, qty: number, discountPercentage: number): any {
    const totalPrice = price * qty * (1 - discountPercentage / 100);
    return totalPrice.toFixed(2);
  }

  calculateSubTotal(): any {
    let subTotal = 0;
    for (const product of this.invoices.products) {
      if (product.price >= 0 && product.qty >= 0) {
        subTotal += product.price * product.qty;
      }
    }
  
    return subTotal.toFixed(2); 
  }
  

  grandTotalNumer() {
    let grandTotal = 0;
    if(this.selectedDiscountType === 'percentage')  {
      for (const product of this.invoices.products) {
        if (product.price >= 0 && product.qty >= 0) {
          grandTotal += product.price * product.qty * (1 - this.totalDiscount / 100);
        }
      }
      grandTotal += this.totalShipping;
      const taxAmount = grandTotal * (this.taxRate / 100);
      grandTotal += taxAmount;
      return grandTotal.toFixed(2);
    } else {
      for (const product of this.invoices.products) {
        if (product.price >= 0 && product.qty >= 0) {
          grandTotal += product.price * product.qty - this.totalDiscount;
        }
      }
      grandTotal += this.totalShipping;
      const taxAmount = grandTotal * (this.taxRate / 100);
      grandTotal += taxAmount;
      return grandTotal.toFixed(2);
    }
  }
  

  discountShow() {
    this.isvisibleButton = false
    this.totalDiscount = 0
  }

  shippingShow() {
    this.isvisibleShippingButton = false
    this.totalShipping = 0
  }

  taxRateShow() {
    this.isvisibleTaxButton = false
    this.taxRate = 0
  }


  handleLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.invoiceLogo = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getsymbol(data: any) {
    return `${data.code} (${data.symbol})`
  }  

  PDFprint(): void {
    const { jsPDF } = require("jspdf");
    switch (this.selectedInvoiceTheme) {
      case 1:
        
      console.log("selectedInvoiceTheme========>>" , this.selectedInvoiceTheme);
    
    

      const doc = new jsPDF();
  
      // Add image
      const img = new Image();
      img.src = '../../../../assets/images/invoice/1/header.png';
      const logoimg = new Image();
      logoimg.src = '../../../../assets/images/invoice/1/footer.png';
      const logo1:any = new Image();
      logo1.src = this.invoiceLogo ? this.invoiceLogo : null;

      img.onload = () => {
        doc.addImage(img, 'JPEG', 0, 0, 211, 60);
        if (this.invoiceLogo) {
          doc.addImage(logo1, 'JPEG', 130, 20 , 50 ,10);
        
        }
        // Add text on top of the image
        
  
        doc.setFontSize(30);
        doc.setTextColor(5,57,84);
        doc.setFont("helvetica", "bold");
        doc.text(this.mainTitle, 15, 47);
  
  
        doc.setFontSize(11);
        doc.setTextColor(122, 122, 122);
        doc.text(`Invoice: ${this.invoiceId}`, 130, 55);
        doc.setFontSize(11);
        doc.setTextColor(5, 5, 5);
        doc.text(`Date: ${this.formatDate(this.invoiceDate)}`, 160, 55);
  
        // Shop Details
        doc.setFontSize(15);
        doc.setTextColor(122, 122, 122);
        doc.text('Form Details', 15, 70);
        doc.setFontSize(11);
        doc.setTextColor(5, 5, 5);
        doc.text(this.invoices.customerName, 15, 78);
        doc.text(this.invoices.email, 15, 84); 
        doc.text(this.invoices.contactNo, 15, 90);
        doc.text(this.invoices.address, 15, 96);
        if (this.isShowFormGst) {
          doc.text(`${this.formGSTName} : ${this.invoices.customerFormGST}`, 15, 102);
        }
  
        //  Customer Details
        doc.setFontSize(15);
        doc.setTextColor(122, 122, 122);
        doc.text('To Details', 150, 70);
        doc.setFontSize(11);
        doc.setTextColor(5, 5, 5);
        doc.text(this.invoices.billTo, 150, 78);
        doc.text(this.invoices.billToEmail, 150, 84);
        doc.text(this.invoices.billToContact, 150, 90);
        doc.text(this.invoices.billToAddress, 150, 96);
        if (this.isShowToGst) {
          doc.text(`${this.toGSTName} : ${this.invoices.customerToGST}`, 150, 102);
        }
  
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Product Details', 15, 115);
  
        // Function to create placeholders
        const createPlaceholder = (count: any) => {
          let placeholders = [];
          for (let i = 0; i < count; i++) {
            placeholders.push(['- -', '00', '00', '00']);
          }
          return placeholders;
        };
  
        // Extract the real data
        const realData = this.invoices.products.map(item => [
          item.name,
          item.price,
          item.qty,
          (item.price * item.qty).toFixed(2)  // Total calculated as price * qty
        ]);
  
        // Add placeholders to fill the rest of the rows
        const totalRows = 5;
        const placeholderCount = totalRows - realData.length;
        const placeholders = createPlaceholder(placeholderCount);
  
        // Combine real data with placeholders
        const tableData = [...realData, ...placeholders];
        // Add table
        (doc as any).autoTable({
          head: [[ 'Item Description' , 'Price', 'Qty', 'Total']],
          body: tableData,
          startY: 120,
          theme: 'plain',
          headStyles: {
            fillColor: [0,62,95],
            textColor: [255, 255, 255],
            fontSize: 10,
            cellPadding: 2,
          },
          didDrawCell: (data: any) => {
            const { cell, row, column } = data;
            // Draw border-bottom for body cells
            if (row.section === 'body') {
              doc.setDrawColor(122, 122, 122);
              doc.setLineWidth(0.2);
              doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
            }
          }
        });
  
  
        // Terms & Conditions
        doc.setFontSize(12);
        doc.setTextColor(122, 122, 122);
        doc.text(this.terms, 10, 180);
        doc.setFontSize(8);
        doc.setTextColor(122, 122, 122);
        doc.text(this.termsList, 10, 188);
  
  
        // Notes
        doc.setFontSize(12);
        doc.setTextColor(122, 122, 122);
        doc.text(this.notes, 10, 220);
        doc.setFontSize(8);
        doc.setTextColor(122, 122, 122);
        doc.text(this.notesList, 10, 228);
  
  
  
        doc.setFontSize(12);
        doc.setTextColor(122, 122, 122);
        doc.text(`${this.text} :` , 145, 180);
        doc.text(`${this.iscurrencyName.split(" ")[0]} ${this.calculateSubTotal()}/-`, 170, 180);
        doc.text(`${this.discount} :`, 145, 188);
        doc.text(`${this.totalDiscount}/-`, 170, 188);
        doc.text(`${this.shipping} :`, 145, 197);
        doc.text(`${this.iscurrencyName.split(" ")[0]} ${this.totalShipping}/-`, 170, 197);
        doc.text(`${this.gst} :`, 145, 206);
        doc.text(`${this.taxRate}%`, 170, 206);
        doc.setLineWidth(0.2);
        doc.line(145, 213, 185, 213);
        doc.setTextColor(5, 5, 5);
        doc.text('Grand Total :', 145, 223);
        doc.text(`${this.iscurrencyName.split(" ")[0]} ${this.grandTotalNumer()}/-`, 170, 223);
  
        doc.addImage(logoimg, 'JPEG', 0, 263, 211, 35);
  
        doc.setLineWidth(0.2);
        doc.line(15, 268, 55, 268);
        doc.setFontSize(10);
        doc.setTextColor(5, 5, 5);
        doc.text('Authorised Sign', 16, 275);
        doc.text(`(${this.invoices.customerName})`, 16, 281);

        // open PDF
        window.open(doc.output('bloburl'))
        // doc.save('invoice.pdf');
  
      };      
        break;
      case 2:
          const doc2 = new jsPDF();
          // Add image
          const img2 = new Image();
          img2.src = '../../../../assets/images/invoice/2/realestate11.1.png';
          const logoimg2 = new Image();
          logoimg2.src = '../../../../assets/images/invoice/2/realestate11.2.png';
      
          const logo:any = new Image();
          logo.src = this.invoiceLogo ? this.invoiceLogo : null;
          img2.onload = () => {
      
            // Add text on top of the image
            doc2.addImage(img2, 'JPEG', 0, 0, 210, 45);
            if (this.invoiceLogo) {
              doc2.addImage(logo, 'JPEG', 150, 10 , 50 ,10);
            
            }
      
            // INVOICE
            doc2.setFontSize(30);
            doc2.setTextColor(255, 255, 255);
            doc2.text(this.mainTitle, 5, 20);
      
      
            // DATE
            doc2.setFontSize(10);
            doc2.setTextColor(255, 255, 255);
            doc2.text(`DATE : ${this.formatDate(this.invoiceDate)}                        INVOICE : ${this.invoiceId}`, 5, 32);
            // doc2.text('DATE :', 20, 38);
            // doc2.text('INVOICE :', 20, 44);
            // doc2.text(`${this.formatDate(this.invoiceDate)}`, 42, 38);
            // doc2.text(`${this.invoiceId}`, 42, 44);
      
      
            // Shop Details 
            doc2.setFontSize(15);
            doc2.setTextColor(5, 5, 5);
            doc2.text('Form Details', 20, 56);
            doc2.setFontSize(12);
            doc2.setTextColor(0, 0, 0);
            doc2.text(this.invoices.customerName, 20, 63);
            doc2.text(this.invoices.email, 20, 69);
            doc2.text(this.invoices.contactNo, 20, 75);
            doc2.text(this.invoices.address, 20, 81);
            if (this.isShowFormGst) {
              doc2.text(`${this.formGSTName} : ${this.invoices.customerFormGST}`, 20, 87);
            }
            
            // Customer Details
            doc2.setFontSize(15);
            doc2.setTextColor(5, 5, 5);
            doc2.text('To Details', 140, 56);
            doc2.setFontSize(12);
            doc2.setTextColor(0, 0, 0);
            doc2.text(this.invoices.billTo, 140, 63);
            doc2.text(this.invoices.billToEmail, 140, 69);
            doc2.text(this.invoices.billToContact, 140, 75);
            doc2.text(this.invoices.billToAddress, 140, 81);
            if (this.isShowToGst) {
              doc2.text(`${this.toGSTName} : ${this.invoices.customerToGST}`, 140, 87);
            }
      
            // // Product Details
            // doc2.setFontSize(12);
            // doc2.setTextColor(0, 0, 0);
            // doc2.text('Product Details', 20, 95);
      

                    // Function to create placeholders
        const createPlaceholder = (count: any) => {
          let placeholders = [];
          for (let i = 0; i < count; i++) {
            placeholders.push(['- -', '00', '00', '00']);
          }
          return placeholders;
        };
  
        // Extract the real data
        const realData = this.invoices.products.map(item => [
          item.name,
          item.price,
          item.qty,
          (item.price * item.qty).toFixed(2)  // Total calculated as price * qty
        ]);
  
        // Add placeholders to fill the rest of the rows
        const totalRows = 5;
        const placeholderCount = totalRows - realData.length;
        const placeholders = createPlaceholder(placeholderCount);
  
        // Combine real data with placeholders
        const tableData = [...realData, ...placeholders];

      
      
      
            (doc2 as any).autoTable({
              head: [[ 'Item Description' , 'Price', 'Qty', 'Total']],
              body:  tableData,
      
              startY: 100,
              theme: 'plain',
              headStyles: {
                fillColor: [0, 32, 93],
                textColor: [255, 255, 255],
                fontSize: 10,
                cellPadding: 3,
              },
              bodyStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
                fontSize: 10,
                cellPadding: 3,
              },
            });
      
      
            // total
            doc2.setFontSize(11);
            doc2.setTextColor(5, 5, 5);
            doc2.text(`${this.text} :`, 139, 175);
            doc2.text(`${this.iscurrencyName.split(" ")[0]} ${this.calculateSubTotal()}/-`, 170, 175);
            doc2.text(`${this.discount} :`, 139, 185);
            doc2.text(`${this.totalDiscount}/-`, 170, 185);
            doc2.text(`${this.shipping} :`, 139, 195);
            doc2.text(`${this.iscurrencyName.split(" ")[0]} ${this.totalShipping}/-`, 170, 195);
            doc2.text(`${this.gst} :`, 139, 205);
            doc2.text(`${this.taxRate}%`, 170, 205);
            doc2.setFillColor(245, 245, 245);
            doc2.rect(138, 209, 60, 10, 'F');
            doc2.text('Grand Total', 139, 215);
            doc2.text(`${this.iscurrencyName.split(" ")[0]} ${this.grandTotalNumer()}/-`, 170, 215);
      
      
      
            // Terms & Conditions
            doc2.setFontSize(10);
            doc2.setTextColor(0, 0, 0);
            doc2.text(this.terms, 13, 175);
            doc2.setFontSize(8);
            doc2.setTextColor(0, 0, 0);
            doc2.text(this.termsList, 13, 183);
      
            // Notes
            doc2.setFontSize(10);
            doc2.setTextColor(0, 0, 0);
            doc2.text(this.notes, 13, 220);
            doc2.setFontSize(8);
            doc2.setTextColor(0, 0, 0);
            doc2.text(this.notesList, 13, 228);
      
            doc2.addImage(logoimg2, 'JPEG', 0, 272, 210, 25);
      
            //  Sign
            doc2.setLineWidth(0.2);
            doc2.line(150, 267, 190, 267);
            doc2.setFontSize(10);
            doc2.setTextColor(5, 5, 5);
            doc2.text('Authorised Sign', 155, 272);
            doc2.text(`(${this.invoices.customerName})`, 155, 277);
      
            // open PDF
            window.open(doc2.output('bloburl'))
      
          };

        break  
      default:
        break;
    }
    if (Boolean(this.cookieService.get('AcceptCookies')) === true) {
      const data :any = {
        logoUrl: this.invoiceLogo,
        title: this.mainTitle,
        id: this.invoiceId,
        billFrom: this.invoices.customerName,
        emailId: this.invoices.email,
        fromAddress: this.invoices.address,
        contactNo: this.invoices.contactNo,
        termsConditions: this.termsList,
        notes: this.notesList
      }

      // Store the data in localStorage
      localStorage.setItem('invoice', JSON.stringify(data));

    }
  }
}

