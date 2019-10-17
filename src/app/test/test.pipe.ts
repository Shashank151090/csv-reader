import { Pipe, PipeTransform } from '@angular/core'; 
import { ValueTransformer } from '@angular/compiler/src/util';
 
@Pipe({
    name:'filterData'
})
export class filterPipe implements PipeTransform {
    transform(value:any): any{
        let arrayToReturn = [];
        let deviceId = value[1];
        if(deviceId) {
            arrayToReturn.push(deviceId[2]);
        }
        for (let i = 1; i < value.length; i++) {
            let tempValue = false;
            let arrayTemp = value[i];
            // console.log(arrayTemp);
            if(arrayTemp[3] && arrayTemp[3].startsWith('A100')){
                for (let j=0; j<arrayToReturn.length; j++){
                    if(arrayToReturn[j].startsWith('A100')) {
                         tempValue = true;
                    }
                }
                if (tempValue == false) {
                    arrayToReturn.push(arrayTemp[3]);
                }
            }
            if(arrayTemp[3] && arrayTemp[3].startsWith('A400')){
                for (let j=0; j<arrayToReturn.length; j++){
                    if(arrayToReturn[j].startsWith('A400')) {
                         tempValue = true;
                    }
                }
                if (tempValue == false) {
                    arrayToReturn.push(arrayTemp[3]);
                }                
            }
            if(arrayTemp[3] && arrayTemp[3].startsWith('A600')){
                for (let j=0; j<arrayToReturn.length; j++){
                    if(arrayToReturn[j].startsWith('A600')) {
                         tempValue = true;
                    }
                }
                if (tempValue == false) {
                    arrayToReturn.push(arrayTemp[3]);
                }                
            }
            if(arrayTemp[3] && arrayTemp[3].startsWith('A700')){
                for (let j=0; j<arrayToReturn.length; j++){
                    if(arrayToReturn[j].startsWith('A700')) {
                         tempValue = true;
                    }
                }
                if (tempValue == false) {
                    arrayToReturn.push(arrayTemp[3]);
                }                
            }
            if(arrayTemp[3] && arrayTemp[3].startsWith('AB00')){
                for (let j=0; j<arrayToReturn.length; j++){
                    if(arrayToReturn[j].startsWith('AB00')) {
                         tempValue = true;
                    }
                }
                if (tempValue == false) {
                    arrayToReturn.push(arrayTemp[3]);
                }                
            }
            if(arrayTemp.length>4) {
                for(let j=4; j<arrayTemp.length;j++) {
                    if(arrayTemp[j] && arrayTemp[j].startsWith('A900')){
                        for (let k=0; k<arrayToReturn.length; k++){
                            if(arrayToReturn[k].startsWith('A900')) {
                                 tempValue = true;
                            }
                        }
                        if (tempValue == false) {
                            arrayToReturn.push(arrayTemp[j]);
                        }                
                    }
                    if(arrayTemp[j] && arrayTemp[j].startsWith('LOCATION')){
                        for (let k=0; k<arrayToReturn.length; k++){
                            if(arrayToReturn[k].startsWith('LOCATION')) {
                                 tempValue = true;
                            }
                        }
                        if (tempValue == false) {
                            arrayToReturn.push(arrayTemp[j]);
                        }                
                    }
                    if(arrayTemp[j] && arrayTemp[j].startsWith('LOGGER')){
                        for (let k=0; k<arrayToReturn.length; k++){
                            if(arrayToReturn[k].startsWith('LOGGER')) {
                                 tempValue = true;
                            }
                        }
                        if (tempValue == false) {
                            arrayToReturn.push(arrayTemp[j]);
                        }                
                    }
                    if(arrayTemp[j] && arrayTemp[j].startsWith('AB')){
                        for (let k=0; k<arrayToReturn.length; k++){
                            if(arrayToReturn[k].startsWith('AB')) {
                                 tempValue = true;
                            }
                        }
                        if (tempValue == false) {
                            arrayToReturn.push(arrayTemp[j]);
                        }                
                    }
                }
            }  
        }

        return arrayToReturn;
    }
}