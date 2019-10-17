import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router }                       from "@angular/router";
import { FileUtil }                     from './file.util';
import { Constants }                    from './test.constants';
import { ExportToCsv }                  from 'export-to-csv';
import { filterPipe }                   from './test.pipe'
import { ApiService }                   from '../api.service';
import { FormBuilder }       from '@angular/forms';
import { ExtractDataService } from '../extract-data.service';
 
@Component({
  templateUrl: './test.component.html',
  encapsulation: ViewEncapsulation.None
})

export class TestComponent implements OnInit {

  @ViewChild('fileImportInput', {static: false})
  fileImportInput: any;

  csvRecords = [];
  csvRecordData = [];
  decodedData:any = [];
  decodedA1Data:any = [];
  decodedA4Data:any = [];
  decodedA6Data:any = [];
  dataIndex = 0;
  filteredData = [];
  objToDisplay = {};
  arrayToDisplay = [];
  registrationForm: any;
  files: any = [{name: '67510A100E'},{name:'67510A100E'}, {name: '67510A100E'}, {name: '67510A100E'}]
  deviceId:string = '67510A1020';

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private filterPipe: filterPipe,
    private api: ApiService,
    public fb: FormBuilder,
    private extractService: ExtractDataService
  ) {
    this.registrationForm = this.fb.group({
      fileName: ['']
    })
   }

  ngOnInit() {
    

   }

 
  
  printCsv() {
    return new Promise((resolve, reject) => {
    this.api.getFiles().subscribe((csvData) => {
      let csvRecordsArray = (csvData as string).split(/\r\n|\n/);

      let headerLength = -1;
      if(Constants.isHeaderPresentFlag){
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length; 
      }
      
      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
           this.filteredData.push(this.filterPipe.transform(this.csvRecords));
           for( let i=0; i< this.filteredData.length; i++) {
             this.decodeData(this.filteredData[i],this.dataIndex)
             for(let j=0; j<this.filteredData[i].length; j++) {
               if (typeof(this.filteredData[i][j]) =="string" && this.filteredData[i][j].startsWith('67')) {
                 this.objToDisplay['deviceId'] = this.filteredData[i][j];
               }
               else if (typeof(this.filteredData[i][j]) =="string" && this.filteredData[i][j].startsWith('A6')) {
                this.objToDisplay['A6'] = this.filteredData[i][j];
              }
              else if (typeof(this.filteredData[i][j]) =="string" && this.filteredData[i][j].startsWith('A4')) {
                this.objToDisplay['A4'] = this.filteredData[i][j];
              }
              else if (typeof(this.filteredData[i][j]) =="string" && this.filteredData[i][j].startsWith('A1')) {
                this.objToDisplay['A1'] = this.filteredData[i][j];
              }
              else if (typeof(this.filteredData[i][j]) =="string" && this.filteredData[i][j].startsWith('A7')) {
                this.objToDisplay['A7'] = this.filteredData[i][j];
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].imei) {
                this.objToDisplay['imei'] = this.filteredData[i][j].imei;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].ccid) {
                this.objToDisplay['ccid'] = this.filteredData[i][j].ccid;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].battery) {
                this.objToDisplay['battery'] = this.filteredData[i][j].battery;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].lat) {
                this.objToDisplay['lat'] = this.filteredData[i][j].lat;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].long) {
                this.objToDisplay['long'] = this.filteredData[i][j].long;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].hwv) {
                this.objToDisplay['hwv'] = this.filteredData[i][j].hwv;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].swv) {
                this.objToDisplay['swv'] = this.filteredData[i][j].swv;
              }
              else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].pv) {
                this.objToDisplay['pv'] = this.filteredData[i][j].pv;
              }
              // else if (typeof(this.filteredData[i][j]) =="object" && this.filteredData[i][j].temp) {
              //   this.objToDisplay['temp'] = this.filteredData[i][j];
              // }

             }
             this.arrayToDisplay.push(this.objToDisplay);


             break;
           }
          console.log(this.filteredData);
          console.log(this.arrayToDisplay);

          
      
      if(this.csvRecords == null){
        //If control reached here it means csv file contains error, reset file.
        this.fileReset();
      }
      const options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: true,
        title: 'My Awesome CSV',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      };
     
    })
    resolve();
  })
  }

  decodeData(data,index) {
    this.dataIndex++;
    for(let i=0; i< data.length; i++) {
      if(typeof(data[i]) =="string" && data[i].startsWith('A4')) {
        this.decodedA4Data = this.extractService.extractA4Data(data[i]);
        console.log("A4 decoded data:",this.decodedA4Data);
        console.log("data without sign", this.extractService.dataWithoutSign);
        this.filteredData[index].push({"battery":this.decodedA4Data.batteryPer});
       this.filteredData[index].push({"lat":this.decodedA4Data.latitute});
       this.filteredData[index].push({"long":this.decodedA4Data.longitute});
       for(let j=0; j<this.decodedA4Data.extractedData.length; j++) {
         this.filteredData[index].push({"temp":this.decodedA4Data.extractedData[j]});
       }
       }

       else if(typeof(data[i]) =="string" && data[i].startsWith('A6')) {
        this.decodedA6Data = this.extractService.extractA6Data(data[i]);
        console.log("A6 decoded data:", this.decodedA6Data);
        this.filteredData[index].push({"imei":this.decodedA6Data.imei});
        this.filteredData[index].push({"ccid":this.decodedA6Data.ccid});
      }  

      else if(typeof(data[i]) =="string" && data[i].startsWith('A1')) {
        this.decodedA1Data = this.extractService.extractA1Data(data[i]);
        console.log("A1 decoded data:", this.decodedA1Data);
        this.filteredData[index].push({"hwv":this.decodedA1Data.hwv});
        this.filteredData[index].push({"swv":this.decodedA1Data.swv});
        this.filteredData[index].push({"pv":this.decodedA1Data.pv});
      }

    }
  }


  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    // this.csvRecords = [];
  }
  readData() {
    this.printCsv().then(res => this.deleteFile());
  }

  downloadFile() {
    return new Promise((resolve, reject) => {
    console.log(this.deviceId);

    let today = new Date();
    let dd = today.getDate()+1;
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    let date=dd.toString();
    let month=mm.toString();
    let year=yyyy.toString();
    if(dd<10) 
    {
      date='0'+dd;
    } 
    
    if(mm<10) 
    {
      month='0'+mm;
    } 
    let todayDate = yyyy+month+date;
    console.log(todayDate);

    window.location.href = 'https://escavoxwebapi.azurewebsites.net/IoT/1.0/GetRaw/'+this.deviceId+'/20190901-0000/'+todayDate+'-0000';
    let newDeviceId = parseInt(this.deviceId,16);
    newDeviceId +=1;
    let hexDeviceId= newDeviceId.toString(16);
    this.deviceId = hexDeviceId.toString();
    resolve();
  })
  }

  deleteFile() {
    // this.api.deleteFiles().subscribe((csvData) => {
      console.log("deleted")
    // })
  }

  printAllData() {
    console.log(this.arrayToDisplay);
    this._fileUtil.convertArrayToCsv(this.arrayToDisplay);
  }

}