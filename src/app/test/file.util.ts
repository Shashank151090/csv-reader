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
        } else if(!rows[i].A6) {
            rows[i].A6 = ""
        } else if(!rows[i].imei) {
            rows[i].imei = ""
        } else if(!rows[i].ccid) {
            rows[i].ccid = ""
        } else if(rows[i].A1) {
            rows[i].A1 = ""
        } else if(!!rows[i].hwv) {
            rows[i].hwv = ""
        } else if(!rows[i].swv) {
            rows[i].swv = ""
        } else if(!rows[i].pv) {
            rows[i].pv = ""
        } else if(!rows[i].A4) {
            rows[i].A4 = ""
        } else if(!rows[i].battery) {
            rows[i].battery = ""
        } else if(!rows[i].lat) {
            rows[i].lat = ""
        } else if(!rows[i].long) {
            rows[i].long = ""
        } else if(!rows[i].temp) {
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