import { Injectable }       from '@angular/core';

@Injectable()
export class FileUtil {

    constructor() {}

    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr, tokenDelimeter) {        
        let headers = csvRecordsArr[0].split(tokenDelimeter);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length != fileHeaaders.length) {
            return false;
        }

        var fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] != fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength, 
        validateHeaderAndRecordLengthFlag, tokenDelimeter) {
        var dataArr = []

        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(tokenDelimeter);
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            if(i==0){
                for(let k =0; k<4 ; k++) {
                    col.push('-')
                }
               
            }
            dataArr.push(col)
        }   
        return dataArr;
    }

    convertArrayToCsv (data) {
        const rows = data
        
        let csvContent = "Device ID, A6, IMEI, CCID, A1, HardWare Version, SoftWare Version, Product Version, A4, Battery Percentage, Latitute, Longitute, Temperature Range \n" 
       for(let i=0;i<rows.length;i++) {
           console.log(rows[i]);

        if(!rows[i].deviceId) {
            rows[i].deviceId = ""
        } 
         if(!rows[i].A6) {
            rows[i].A6 = ""
        } 
         if(!rows[i].imei) {
            rows[i].imei = ""
        } 
         if(!rows[i].ccid) {
            rows[i].ccid = ""
        } 
         if(!rows[i].A1) {
            rows[i].A1 = ""
        } 
         if(!rows[i].hwv) {
            rows[i].hwv = ""
        } 
         if(!rows[i].swv) {
            rows[i].swv = ""
        } 
         if(!rows[i].pv) {
            rows[i].pv = ""
        } 
         if(!rows[i].A4) {
            rows[i].A4 = ""
        } 
         if(!rows[i].battery) {
            rows[i].battery = ""
        } 
         if(!rows[i].lat) {
            rows[i].lat = ""
        } 
         if(!rows[i].long) {
            rows[i].long = ""
        } 
         if(!rows[i].temp) {
            rows[i].temp = ""
        }

           csvContent += rows[i].deviceId + ','+
                         rows[i].A6+','+
                         rows[i].imei+','+ 
                         rows[i].ccid+','+ 
                         rows[i].A1+','+ 
                         rows[i].hwv+','+ 
                         rows[i].swv+','+ 
                         rows[i].pv+','+ 
                         rows[i].A4+','+ 
                         rows[i].battery+','+ 
                         rows[i].lat+','+ 
                         rows[i].long+',';
           for(let j=0;j<rows[i].temp.length;j++) {
               csvContent += rows[i].temp[j].temp + ','
           }
           csvContent += '\n'

       }

            console.log(csvContent);
             this.downloadCsv(csvContent)
    }
    downloadCsv(csvContent) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Details.csv';
        hiddenElement.click();
    }

    

}