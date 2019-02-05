import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../classes/constants';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let valor =this.getformato(value, args);
    return valor.toString().replace(/\./g,',');
  }

  getformato(number: any, unit: any){
    let valor = this.decimal(number/unit.divisor);
    const pointIndex = valor.toString().indexOf('.');
    const decimals = pointIndex > -1 ? valor.toString().length - pointIndex - 1 : 0;
    valor = decimals === 0 ? `${valor}.00` : decimals === 1 ? `${valor}0` : valor;
    return valor + unit.label;
  }



  decimal(number){
    if (number.toString().length >3){
      let trunc = parseFloat(number).toFixed(2);
      return trunc;
    }
    else return number;
  }

}
