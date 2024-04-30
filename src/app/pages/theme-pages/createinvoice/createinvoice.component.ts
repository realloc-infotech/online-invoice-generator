import { Component, Inject, Optional } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, UntypedFormArray, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../theme/service/invoice.service';
import { CookieService } from 'ngx-cookie-service';
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
  termsList: ''
  notesList: ''
  iscurrencyName: any = ''
  isInvoiceId : boolean = false
  invoiceId :any =  1
  text: string = "Sub Total"; // Input text
  discount: any = "Discount"; // Input text
  shipping: any = "Shipping";
  mainTitle: any = "INVOICE";
  gst: any = "Gst";
  terms: any = "Terms and conditions";
  notes: any = "Notes";
  isEditing: boolean = false;
  isDiscount: boolean = false;
  isShipping: boolean = false;
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

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private invoiceService :InvoiceService,
    private cookieService :CookieService,
    private router: Router,
    private http: HttpClient,
    // public dialogRef: MatDialogRef<CreateinvoiceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.isInvoiceThemeColor = this.invoiceThemeColorList[0].colorCode

    this.addForm = this.fb.group({});

    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());

    this.http.get<any>('../../../../assets/currency/Currency.json').subscribe(
      data => {
        this.currencyList = data
      },
      error => {
        console.log('Error fetching JSON data:', error);
      }
    );

    if(this.cookieService.get('invoice')){
      const value = JSON?.parse(this.cookieService.get('invoice'))
  
      if(value) {
        this.invoiceLogo = value?.logoUrl
        this.mainTitle = value?.title
        this.invoiceId = value?.id + 1
        this.invoices.customerName = value?.billFrom
        this.invoices.email = value?.emailId
        this.invoices.address = value?.fromAddress
        this.invoices.contactNo = value?.contactNo
        this.termsList = value?.termsConditions
        this.notesList = value?.notes
      }
    }

    this.generatePdf()
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


  generatePdf() {
    const imageUrl = '../../.././../assets/images/pdfBill.png'; // Path to your image file

    // Load the image as a blob
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
      // Convert blob to data URL
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        this.invoice =  dataUrl
        console.log("invoice=>>>>>>" , this.invoice);
        
      };
    });
  }

  generatePDF(action = 'open') {
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
          width: 100,
          alignment: 'center',
          margin: [0, 10]
        },
          {
          columns: [
            [ {
              text: this.mainTitle,
              fontSize: 20,
              bold: true,
              alignment: 'start',
              color: this.isInvoiceThemeColor,
              margin: [0, 0, 0, 20] // Add some space after the title
            },],
            [
              {
                text:  'Invoice No' + this.invoiceId,
                fontSize: 20,
                bold: true, 
                alignment: 'right',
                color: this.isInvoiceThemeColor,
                margin: [0, 0, 0, 10] // Add some space after the title
              },
              {
                text:  this.formatDate(this.invoiceDate), // Add invoice date here
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
                { text: 'Customer Details\n', style: 'sectionHeader' },
                { text: this.invoices.customerName + '\n', bold: true },
                this.invoices.email + '\n',
                this.invoices.contactNo + '\n',
                this.invoices.address
              ]
            },
            // Bill Details on the right
            {
              width: '*',
              alignment: 'right',
              text: [
                { text: 'Bill Details\n', style: 'sectionHeader' },
                { text: this.invoices.billTo + '\n', bold: true },
                this.invoices.billToEmail + '\n',
                this.invoices.billToContact + '\n',
                this.invoices.billToAddress
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
            body: [
              [
                { text: 'Product', style: 'tableHeader', border: [] },
                { text: 'Price', style: 'tableHeader', border: [] },
                { text: 'Quantity', style: 'tableHeader', border: [] },
                { text: 'Amount', style: 'tableHeader', border: [] }
              ],
              ...this.invoices.products.map(p => ([
                { text: p.name, fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] },
                { text: p.price, fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] , alignment: 'center',},
                { text: p.qty, fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] ,alignment: 'center', },
                { text: this.calculateTotalPrice(p.price, p.qty, p.discount), fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] , alignment: 'center', }
              ])),
              // [{ text: 'Total Amount', colSpan: 3, fillColor: '#eceff7' ,  border: [] ,  margin: [0, 5, 0, 5] }, {}, {}, {}, { text: this.invoices.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2), fillColor: '#eceff7' , border: [] }]
            ]
          }
        },
        // {
        //   text: 'Additional Details',
        //   style: 'sectionHeader'
        // },

        {
          margin: [0, 20, 0, 10],
          columns: [
            {
              width: '*',
              alignment: 'right',
              text : this.totalTextData
            }
          ],
        },
        {
          text: 'Terms',
          style: 'sectionHeader',
          margin: [0, 20, 0, 5] // Add space before and after the section
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
        {
          text: 'Signature',
          margin: [0, 35, 0, 5], // Adjust margins as needed
          alignment: 'right' // Align the text to the right
        },
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
    
    if(this.invoiceService.getData()) {
      const data = {
        logoUrl : this.invoiceLogo,
        title : this.mainTitle,
        id : this.invoiceId,
        billFrom : this.invoices.customerName,
        emailId : this.invoices.email,
        fromAddress : this.invoices.address,
        contactNo : this.invoices.contactNo,
        termsConditions : this.termsList,
        notes : this.notesList
      }
  
      this.cookieService.set('invoice', JSON.stringify(data));
    }

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download(`${this.invoiceId}/${this.invoices.billTo}`);
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }

  }

  openPdfDemo(){
    let docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60], // [left, top, right, bottom]
      background: function (currentPage: any) {
        return {
          canvas: [
            {
              type: 'line',
              x1: 40, // Left margin
              y1: 60, // Top margin
              x2: 40, // Left margin
              y2: 781.89, // 841.89 - Bottom margin
              lineColor: '#000' // Line color
            },
            {
              type: 'line',
              x1: 40, // Left margin
              y1: 60, // Top margin
              x2: 555.28, // A4 width - Right margin
              y2: 60, // Top margin
              lineColor: '#000'
            },
            {
              type: 'line',
              x1: 555.28, // A4 width - Right margin
              y1: 60, // Top margin
              x2: 555.28, // A4 width - Right margin
              y2: 781.89, // 841.89 - Bottom margin
              lineColor: '#000'
            },
            // Bottom margin line
            {
              type: 'line',
              x1: 40, // Left margin
              y1: 781.89, // 841.89 - Bottom margin
              x2: 555.28, // A4 width - Right margin
              y2: 781.89, // 841.89 - Bottom margin
              lineColor: '#000'
            }
          ]
        };
      },
      content: [
        {
          image: this.invoice,
          width: 510, // Set the width of the image
          height: 150, // Set the height of the image
        },
      ]
    }
    pdfMake.createPdf(docDefinition).print();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
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
    
    let docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60], // [left, top, right, bottom]
      content: [
        {
          image: this.invoiceLogo,
          width: 100,
          alignment: 'center',
          margin: [0, 10]
        },
        {
          text: this.mainTitle,
          fontSize: 20,
          bold: true, 
          alignment: 'start',
          color: 'green',
          margin: [0, 0, 0, 20] // Add some space after the title
        },
        {
          columns: [
            // Customer Details on the left
            {
              width: '*',
              alignment: 'left',
              text: [
                { text: 'Customer Details\n', style: 'sectionHeader' },
                { text: this.invoices.customerName + '\n', bold: true },
                this.invoices.email + '\n',
                this.invoices.contactNo + '\n',
                this.invoices.address
              ]
            },
            // Bill Details on the right
            {
              width: '*',
              alignment: 'right',
              text: [
                { text: 'Bill Details\n', style: 'sectionHeader' },
                { text: this.invoices.billTo + '\n', bold: true },
                this.invoices.billToEmail + '\n',
                this.invoices.billToContact + '\n',
                this.invoices.billToAddress
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
            body: [
              [
                { text: 'Product', style: 'tableHeader', border: [] },
                { text: 'Price', style: 'tableHeader', border: [] },
                { text: 'Quantity', style: 'tableHeader', border: [] },
                { text: 'Amount', style: 'tableHeader', border: [] }
              ],
              ...this.invoices.products.map(p => ([
                { text: p.name, fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] },
                { text: p.price, fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] , alignment: 'center',},
                { text: p.qty, fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] ,alignment: 'center', },
                { text: this.calculateTotalPrice(p.price, p.qty, p.discount), fillColor: '#eceff7' ,  border : [] ,  margin: [0, 3, 0, 3] , alignment: 'center', }
              ])),
              // [{ text: 'Total Amount', colSpan: 3, fillColor: '#eceff7' ,  border: [] ,  margin: [0, 5, 0, 5] }, {}, {}, {}, { text: this.invoices.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2), fillColor: '#eceff7' , border: [] }]
            ]
          }
        },
        // {
        //   text: 'Additional Details',
        //   style: 'sectionHeader'
        // },

        {
          margin: [0, 20, 0, 10],
          columns: [
            {
              width: '*',
              alignment: 'right',
              text : this.totalTextData
            }
          ],
        },        
        // {
        //   columns: [
        //     [{ qr: `${this.invoices.customerName}`, fit: '50' }],
        //     [{ text: 'Signature', alignment: 'right', italics: true }]
        //   ]
        // },
        {
          text: 'Terms',
          style: 'sectionHeader',
          margin: [0, 20, 0, 5] // Add space before and after the section
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
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          color: 'green',
          margin: [0, 15, 0, 5] // Adjust top and bottom margins
        },
        tableHeader: {
          bold: false,
          fontSize: 12,
          fillColor: 'green',
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
      subTotal += product.price * product.qty;
    }

    return subTotal.toFixed(2) ? subTotal.toFixed(2) : 0;
  }

  grandTotalNumer() {
    let grandTotal = 0;
    for (const product of this.invoices.products) {
      grandTotal += product.price * product.qty * (1 - this.totalDiscount / 100);
    }
    grandTotal += this.totalShipping;
    const taxAmount = grandTotal * (this.taxRate / 100);
    grandTotal += taxAmount;
    return grandTotal.toFixed(2);
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
    return `${data.code} (${data.symbol_native})`
  }
}

