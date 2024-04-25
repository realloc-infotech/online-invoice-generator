import { Component, Inject, Optional } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, UntypedFormArray, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
  termsList : ''
  text: string = "Sub Total"; // Input text
  discount: any = "Discount"; // Input text
  shipping: any = "Shipping";
  gst: any = "Gst";
  terms: any = "Terms";
  isEditing: boolean = false;
  isDiscount: boolean = false;
  isShipping: boolean = false;
  isGst: boolean = false;
  isTerms: boolean = false;
  invoiceLogo: string | ArrayBuffer | null = null;


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    // public dialogRef: MatDialogRef<CreateinvoiceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {


    this.addForm = this.fb.group({});

    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());
  }

  ////////////////////////////////////////////////////////////////////////////////////
  onAddRow(): void {
    this.rows.push(this.createItemFormGroup());
  }

  closeImg(){
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


  generatePDF(action = 'open') {
    let docDefinition: any = {
      content: [
        {
          image: this.invoiceLogo, // Add uploaded logo
          width: 100, // Adjust width as needed
          alignment: 'center',
          margin: [0, 10]
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoices.customerName,
                bold: true
              },
              { text: this.invoices.email },
              { text: this.invoices.contactNo },
              { text: this.invoices.address }
            ],
            [
              {
                text: this.invoices.billTo,
                bold: true,
                alignment: 'right'
              },
              {
                text: this.invoices.billToEmail,
                alignment: 'right'
              },
              {
                text: this.invoices.billToContact,
                alignment: 'right'
              },
              {
                text: this.invoices.billToAddress,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto',  'auto' , 'auto'],
            body: [
              ['Product', 'Price', 'Quantity','Discount', 'Amount'],
              ...this.invoices.products.map(p => ([p.name, p.price, p.qty, p.discount ,this.calculateTotalPrice(p.price , p.qty , p.discount)])),
              [{ text: 'Total Amount', colSpan: 3 }, {}, {}, {} ,this.invoices.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: this.invoices.additionalDetails,
          margin: [0, 0, 0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoices.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ]
        },
        {
          text: this.terms,
          style: 'sectionHeader'
        },
        {
          ul: this.termsList.split('\n').filter((item :any) => item.trim() !== ''),
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }

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
    let docDefinition: any = {
      content: [
        {
          text: 'ELECTRONIC SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoices.customerName,
                bold: true
              },
              { text: this.invoices.email },
              { text: this.invoices.contactNo },
              { text: this.invoices.address }
            ],
            [
              {
                text: this.invoices.billTo,
                bold: true,
                alignment: 'right'
              },
              {
                text: this.invoices.billToEmail,
                alignment: 'right'
              },
              {
                text: this.invoices.billToContact,
                alignment: 'right'
              },
              {
                text: this.invoices.billToAddress,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoices.products.map(p => ([p.name, p.price, p.qty, (p.price * p.qty).toFixed(2)])),
              [{ text: 'Total Amount', colSpan: 3 }, {}, {}, this.invoices.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: this.invoices.additionalDetails,
          margin: [0, 0, 0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoices.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
          ul: [
            'Order can be return in max 10 days.',
            'Warrenty of the product will be subject to the manufacturer terms and conditions.',
            'This is system generated invoices.',
          ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    // Download PDF
    pdfDocGenerator.getBlob((blob: Blob) => {
      // Create WhatsApp message with PDF upload link
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
      subTotal += product.price * product.qty * (1 - product.discount / 100);
    }
    return subTotal.toFixed(2) ? subTotal.toFixed(2) : 0;
  }

  calculateTotalDiscounts(): any {
    let totalDiscounts = 0;
    for (const product of this.invoices.products) {
      totalDiscounts += product.discount;
    }
    return totalDiscounts ? totalDiscounts : 0;
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

}

