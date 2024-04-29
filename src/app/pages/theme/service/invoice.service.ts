import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  
  isInoviceData:any;

  constructor() { }

  setData(value:any) {
    this.isInoviceData = value
  }

  getData(){
    return this.isInoviceData
  }
}
