import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExtractDataService {

  constructor() { }
  dataWithoutSign = [];
  
  extractA4Data(data) {
    let originalData = data;
    let typeOfMessage = data.substring(0,2);
    data = data.slice(2);     
    let messageCounter = data.substring(0,4);
    data = data.slice(4);     
    let numberOfSamples = parseInt(data.substring(0,4),16);
    data = data.slice(4);     
    let currentTempSample = data.substring(0,4);
    data = data.slice(4);     
    data.substring(0,2);
    data = data.slice(2);
    let batteryPer = data.substring(0,2);
    data = data.slice(2);     
    let dataSamples = data.substring(0,(numberOfSamples*6));
    data = data.slice(numberOfSamples*6);
    let extractedData = this.extractDataSamples(dataSamples,numberOfSamples);     
    let lat = parseInt(data.substring(0,8), 16)/100000;
    data = data.slice(8);     
    let long = parseInt(data.substring(0,8),16)/100000;
    data = data.slice(8);     
    let debugByte = data.substring(0,2);
    data = data.slice(2);     
    let lbs = data.substring(0,2);
    data = data.slice(2);     
    let counter = data.substring(0,2);
    data = data.slice(2);
    let createReturnObj = {
      "typeOfMessage": typeOfMessage,
      "messageCounter": messageCounter,
      "numberOfSamples": numberOfSamples,
      "currentTempSample": currentTempSample,
      "batteryPer": batteryPer,
      "extractedData": extractedData,
      "latitute": lat,
      "longitute": long,
      "debugByte": debugByte,
      "lbs": lbs,
      "counter": counter
    }

    return(createReturnObj);
     
  }
  extractA6Data(data) {
    let originalData = data;
    let ccid = data.substring(10,48);
    data = data.slice(48);     
    let imei = data.substring(2,32);
    data = data.slice(32); 
    let createReturnObjA6 = {
      "ccid": ccid,
      "imei": imei
    } 
    return(createReturnObjA6);   
  }
  extractA1Data(data) {
    let originalData = data;
    data = data.slice(26);
    let hwv = data.substring(0,4);
    data = data.slice(4);     
    let swv = data.substring(0,4);
    data = data.slice(4); 
    let pv = data.substring(0,4);
    data = data.slice(4); 
    let createReturnObjA6 = {
      "hwv": hwv,
      "swv": swv,
      "pv": pv
    } 
    return(createReturnObjA6);   
  }

  extractDataSamples(dataSamples,numberOfSamples) {
    let arrayToReturn = []
    for(let i=0; i< numberOfSamples; i++) {
      let tempInString =  dataSamples.substring(0,4);
      let compareTemp = parseInt('7FFF',16);
      let checkSign = this.checkForSign(tempInString);
      let tempInHex = parseInt(tempInString, 16);
      let tempInInt = (tempInHex & compareTemp)/10;
      this.dataWithoutSign.push(tempInInt);
      arrayToReturn.push(checkSign+tempInInt);
      dataSamples = dataSamples.slice(6)
    }
    return arrayToReturn;
  }
  checkForSign(data) {
    let comparer = parseInt('8000',16)
    let checkForSign = parseInt(data,16);
    let result = checkForSign & comparer;
    if (result == 32768) {
      return('-')
    } 
    else if(result == 0) {
      return('+')
    }

  }
}
