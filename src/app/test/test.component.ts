import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router }                       from "@angular/router";
import { FileUtil }                     from './file.util';
import { Constants }                    from './test.constants';
import { filterPipe }                   from './test.pipe'
import { ApiService }                   from '../api.service';
import { ExtractDataService } from '../extract-data.service';
 
@Component({
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TestComponent implements OnInit {

  @ViewChild('fileImportInput', {static: false})
  fileImportInput: any;

  csvRecords = [];
  csvRecordData = [];
  decodedA1Data:any = [];
  decodedA4Data:any = [];
  decodedA6Data:any = [];
  tempRange:any = [];
  dataIndex = 0;
  filteredData = [];
  objToDisplay = {};
  arrayToDisplay = [];
  tableHeader = ['Device Id', 'A6', 'CCID', 'IMEI', 'A4', 'Battery %', 'Latitute', 'Longitute', 'A1', 'Pv', 'Software Version', 'Hardware Version', 'Temperature Range']
  deviceId:string = '67510A1020';

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private filterPipe: filterPipe,
    private api: ApiService,
    private extractService: ExtractDataService
  ) {
    
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
          //  for( let i=0; i< this.filteredData.length; i++) {
             this.decodeData(this.filteredData[0],this.dataIndex)
             let objToDisplay = {}
            for(let j=0;j<this.filteredData[0].length;j++){
              if (typeof(this.filteredData[0][j]) =="string" && this.filteredData[0][j].startsWith('67')) {
                objToDisplay['deviceId'] = this.filteredData[0][j];
              }
              else if (typeof(this.filteredData[0][j]) =="string" && this.filteredData[0][j].startsWith('A6')) {
                objToDisplay['A6'] = this.filteredData[0][j];
              }
              else if (typeof(this.filteredData[0][j]) =="string" && this.filteredData[0][j].startsWith('A4')) {
                objToDisplay['A4'] = this.filteredData[0][j];
              }
              else if (typeof(this.filteredData[0][j]) =="string" && this.filteredData[0][j].startsWith('A1')) {
                objToDisplay['A1'] = this.filteredData[0][j];
              }
              else if (typeof(this.filteredData[0][j]) =="string" && this.filteredData[0][j].startsWith('A7')) {
                objToDisplay['A7'] = this.filteredData[0][j];
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].imei) {
                let decodedImei = this.decodeImie(this.filteredData[0][j].imei) 
                objToDisplay['imei'] = decodedImei;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].ccid) {
                let decodedCcid = this.decodeImie(this.filteredData[0][j].ccid) 
                objToDisplay['ccid'] = decodedCcid;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].battery) {
                objToDisplay['battery'] = this.filteredData[0][j].battery;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].lat) {
                objToDisplay['lat'] = this.filteredData[0][j].lat;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].long) {
                objToDisplay['long'] = this.filteredData[0][j].long;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].hwv) {
                objToDisplay['hwv'] = this.filteredData[0][j].hwv;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].swv) {
                objToDisplay['swv'] = this.filteredData[0][j].swv;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].pv) {
                objToDisplay['pv'] = this.filteredData[0][j].pv;
              }
              else if (typeof(this.filteredData[0][j]) =="object" && this.filteredData[0][j].temp) {
                this.tempRange.push(this.filteredData[0][j]);  
                objToDisplay['temp'] = this.tempRange;              
              }
            }
            this.tempRange = []; 
            this.arrayToDisplay.push(objToDisplay);
          console.log(this.arrayToDisplay)
          this.filteredData = [];

          
      
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
 

  decodeImie(data) {
    let stringToReturn = "";
    for (let i=1; i<=data.length; i+=2) {
      stringToReturn = stringToReturn + data.charAt(i);
    }
    return stringToReturn;
  }

  decodeData(data,index) {
    this.dataIndex++;
    for(let i=0; i< data.length; i++) {
      if(typeof(data[i]) =="string" && data[i].startsWith('A4')) {
        this.decodedA4Data = this.extractService.extractA4Data(data[i]);
        // console.log("A4 decoded data:",this.decodedA4Data);
        // console.log("data without sign", this.extractService.dataWithoutSign);
        this.filteredData[0].push({"battery":this.decodedA4Data.batteryPer});
       this.filteredData[0].push({"lat":this.decodedA4Data.latitute});
       this.filteredData[0].push({"long":this.decodedA4Data.longitute});
       for(let j=0; j<this.decodedA4Data.extractedData.length; j++) {
         this.filteredData[0].push({"temp":this.decodedA4Data.extractedData[j]});
       }
       }

       else if(typeof(data[i]) =="string" && data[i].startsWith('A6')) {
        this.decodedA6Data = this.extractService.extractA6Data(data[i]);
        // console.log("A6 decoded data:", this.decodedA6Data);
        this.filteredData[0].push({"imei":this.decodedA6Data.imei});
        this.filteredData[0].push({"ccid":this.decodedA6Data.ccid});
      }  

      else if(typeof(data[i]) =="string" && data[i].startsWith('A1')) {
        this.decodedA1Data = this.extractService.extractA1Data(data[i]);
        // console.log("A1 decoded data:", this.decodedA1Data);
        this.filteredData[0].push({"hwv":this.decodedA1Data.hwv});
        this.filteredData[0].push({"swv":this.decodedA1Data.swv});
        this.filteredData[0].push({"pv":this.decodedA1Data.pv});
      }

    }
  }


  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    // this.csvRecords = [];
  }
  readData() {
    setTimeout(() => {
      this.printCsv().then(res => this.deleteFile());
    }, 5000)
   
  }


repeat2() {
  for(var i = 0;i < 10; i++){
    let k = i;
    let that = this
    setTimeout(function(){
      that.getData(event);
        // console.log('count ', k);
    }, 20000 * (k + 1));
}
}
  
 

// repeatData(i) {
//     setTimeout(() =>{
//       // this.getData(event);
//     },10000)
//   }


  getData(event?:any) {
    // console.log(event);
    this.downloadFile().then(res => 
      setTimeout (() => {
      this.readData()
    }, 5000)
      );
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
    // console.log(todayDate);

    window.location.href = 'https://escavoxwebapi.azurewebsites.net/IoT/1.0/GetRaw/'+this.deviceId+'/20190901-0000/'+todayDate+'-0000';
    let newDeviceId = parseInt(this.deviceId,16);
    newDeviceId +=1;
    let hexDeviceId= newDeviceId.toString(16);
    this.deviceId = hexDeviceId.toString();
    resolve();
    
  })
  }

  deleteFile() {
    this.api.deleteFiles().subscribe((csvData) => {
      console.log("deleted")
    })
  }

  printAllData() {
    this._fileUtil.convertArrayToCsv(this.arrayToDisplay);
  }

}