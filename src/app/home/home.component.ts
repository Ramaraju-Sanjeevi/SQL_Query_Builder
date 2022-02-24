import { Component, OnInit } from '@angular/core';
import { TableDataServiceService } from '../customservices/table-data-service.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cols: any[] = [];
  selectedKeys: any = [];
  availableOperations: any[] = [];
  availabletables: any[] = [];
  selectedTable: any;
  selectedKey: any;
  selectedCondition: any;
  selectedValue: any;
  defaultTableValues: any[] = [];
  querySelectedValue: any[] = [];
  showqueryData: boolean = false;
  isLoading: boolean = false;
  captioName: string = '';
  showActionButtons: boolean = false;
  canblockedPanel: boolean = false;
  showQueryInput: boolean = false;
  showConditionInput: boolean = false;
  showKeyInput: boolean = false;

  constructor( private tableDataServiceService: TableDataServiceService ) {
    this.availabletables = [
      {tableId: 1,tableName:'Users'}, {tableId: 2,tableName:"Products"}
    ];
   }

  ngOnInit(): void {}

  tableChange(event: any){
    console.log(event.value);
    if(event.value){
      this.showConditionInput = false;
      this.showQueryInput = false;
      this.showActionButtons = false;
      this.fetchData(event.value.tableId);
    } else {
      this.cols = [];
      this.defaultTableValues = [];
      this.querySelectedValue = [];
      this.showqueryData = false;
      this.selectedKey = '';
      this.selectedCondition = '';
      this.selectedValue = '';
    }
  }

  fetchData(id: number){
    if(id === 1){
      this.captioName = 'List of Users';
      this.tableDataServiceService.getUsers().subscribe( data => {
        if(data && data.data && data.data.length > 0){
          this.cols = [];
          this.setData(data.data);
        } else {
          this.showqueryData = false;
          console.log("No Records Found")
        }
      })
    } else if(id ===2 ){
      this.captioName = 'List of Products';
      this.tableDataServiceService.getProducts().subscribe( data => {
        if(data && data.data && data.data.length > 0){
          this.cols = [];
          this.setData(data.data);
        } else {
          this.showqueryData = false;
          console.log("No Records Found")
        }
      })
    }
  }

  setData(tableData: any){
    this.defaultTableValues = tableData;
    this.querySelectedValue = tableData;
    console.log(this.querySelectedValue);
    if(this.querySelectedValue.length > 0) {
      let x = this.querySelectedValue[0];
      Object.entries(x).forEach(([key, value],index) => {
        const capitalize1 = key.charAt(0).toUpperCase() + key.slice(1);
        const x  = typeof(value);
        let inputType = ''
        if(x === 'number'){
          inputType = 'number'
        } else {
          inputType = 'text'
        }
        let colObj = {field: key, header: capitalize1, id: index, dataType: x, type: inputType};
        this.cols.push(colObj)
      });
      console.log(this.cols);
      this.showqueryData = true;
    }
  }

  keyChange(event: any){
    console.log(event.value);
    if(event.value){
      this.querySelectedValue = this.defaultTableValues;
      if(event.value.dataType === 'number'){
        this.availableOperations = [
         { opId: 1, opName: 'Equal' , opSymbol: '=' },
         { opId: 2, opName: 'Not equal' , opSymbol: '!=' },
         { opId: 3, opName: 'Greater than' , opSymbol: '>' },
         { opId: 4, opName: 'Less than' , opSymbol: '<' },
         { opId: 5, opName: 'Less than or equal' , opSymbol: '<=' },
         { opId: 6, opName: 'Greater than or equal' , opSymbol: '>=' },
        ]
      } else if(event.value.dataType === 'string'){
        this.availableOperations = [
          { opId: 1, opName: 'Equal' , opSymbol: '=' },
          { opId: 2, opName: 'Not equal' , opSymbol: '!=' },
          { opId: 7, opName: 'Contains' , opSymbol: 'contains' },
          { opId: 8, opName: 'Starts With' , opSymbol: 'starts with' },
          { opId: 9, opName: 'Ends With' , opSymbol: 'ends with' },
          { opId: 10, opName: 'Is Empty' , opSymbol: 'is empty' },
          { opId: 11, opName: 'Is Not Empty' , opSymbol: 'is not empty' },
          { opId: 12, opName: 'Is Null' , opSymbol: 'is null' },
          { opId: 13, opName: 'Is Not Null' , opSymbol: 'is not null' },
         ]
      }
      this.showConditionInput = true;
      this.selectedCondition = '';
      this.selectedValue = '';
      this.showActionButtons = false;
      this.showQueryInput = false
    } else {
      this.querySelectedValue = this.defaultTableValues;
      this.selectedKey = '';
      this.selectedCondition = '';
      this.selectedValue = '';
      this.showConditionInput = false;
      this.showQueryInput = false;
      this.showActionButtons = false
    }
  }

  conditionChange(event: any){
    this.querySelectedValue = this.defaultTableValues;
    this.selectedValue = '';
    if(event.value.opId === 10 || event.value.opId === 11 || event.value.opId === 12 || event.value.opId === 13 ){
      this.showActionButtons = true;
      this.showQueryInput =  false;
    } else {
      this.showActionButtons = false;
      this.showQueryInput =  true;
    }
    
    
    
    console.log(event.value);
  }

  queryValueChange(event: any){
    if(event  === ''){
      this.showActionButtons = false;
      this.querySelectedValue = this.defaultTableValues
    } else if(event !== ''){
      this.showActionButtons = true;
    } else {
      this.showActionButtons = false;
      this.querySelectedValue = this.defaultTableValues
    }
  }

  fetchQueryData(){
    this.isLoading = true;
    this.querySelectedValue = this.defaultTableValues.filter( (x: any) => {
      let queryValue: any = this.selectedValue;
      if(this.selectedCondition.opId === 1){
        // if operation is  'Equal';
        if(this.selectedKey.type === 'number'){
          queryValue = Number(this.selectedValue);
          this.isLoading = false;
          return x[this.selectedKey.field] === queryValue;
        } else {
          this.isLoading = false;
          return x[this.selectedKey.field].toLowerCase() === queryValue.toLowerCase();
        }
      } else if(this.selectedCondition.opId === 2){
        // if operation is  'Not Equal';
        if(this.selectedKey.type === 'number'){
          queryValue = Number(this.selectedValue);
          this.isLoading = false;
          return x[this.selectedKey.field] !== queryValue;
        } else {
          this.isLoading = false;
          return x[this.selectedKey.field].toLowerCase() !== queryValue.toLowerCase();
        }
        
      } else if(this.selectedCondition.opId === 3){
        // if Operation is Greater than
        if(this.selectedKey.type === 'number'){
          queryValue = Number(this.selectedValue);
          this.isLoading = false;
          return x[this.selectedKey.field] > queryValue;
        }
      } else if(this.selectedCondition.opId === 4){
        // if Operation is Less than
        if(this.selectedKey.type === 'number'){
          queryValue = Number(this.selectedValue);
          this.isLoading = false;
          return x[this.selectedKey.field] < queryValue;
        }
      } else if(this.selectedCondition.opId === 5){
        // if Operation is Less than or Equal
        if(this.selectedKey.type === 'number'){
          queryValue = Number(this.selectedValue);
          this.isLoading = false;
          return x[this.selectedKey.field] < queryValue || x[this.selectedKey.field] === queryValue;
        }
      } else if(this.selectedCondition.opId === 6){
        // if Operation is Less than or Equal
        if(this.selectedKey.type === 'number'){
          queryValue = Number(this.selectedValue);
          this.isLoading = false;
          return x[this.selectedKey.field] > queryValue || x[this.selectedKey.field] === queryValue;
        }
      } else if(this.selectedCondition.opId === 7){
        // if Operation is COntains
        this.isLoading = false;
        return x[this.selectedKey.field].toLowerCase().includes(queryValue.toLowerCase());
      } else if(this.selectedCondition.opId === 8){
        // if Operation is Starts With
        this.isLoading = false;
        return x[this.selectedKey.field].toLowerCase().startsWith(queryValue.toLowerCase());
      } else if(this.selectedCondition.opId === 9){
        // if Operation is Ends With
        this.isLoading = false;
        return x[this.selectedKey.field.toLowerCase()].endsWith(queryValue.toLowerCase());
      } else if(this.selectedCondition.opId === 10){
        // if Operation is Is Empty
        this.isLoading = false;
        return x[this.selectedKey.field] === '';
      } else if(this.selectedCondition.opId === 11){
        // if Operation is Is Not Empty
        this.isLoading = false;
        return x[this.selectedKey.field] !== '';
      } else if(this.selectedCondition.opId === 12){
        // if Operation is Is Null
        this.isLoading = false;
        return x[this.selectedKey.field] === null;
      } else if(this.selectedCondition.opId === 13){
        // if Operation is Is Not Null
        this.isLoading = false;
        return x[this.selectedKey.field] !== null || x[this.selectedKey.field] !== '';
      } else {
        this.isLoading = false;
        return 
      }
    })
    
  }

  ClearQuery(){
    this.isLoading = false;
    this.selectedKey = '';
    this.selectedCondition = '';
    this.selectedValue = '';
    this.querySelectedValue = this.defaultTableValues;
    this.showConditionInput = false;
    this.showQueryInput = false;
    this.showActionButtons = false;
  }
  
}
