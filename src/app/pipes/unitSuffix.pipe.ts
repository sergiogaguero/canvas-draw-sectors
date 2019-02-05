import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unitSuffix' })
export class UnitSuffixPipe implements PipeTransform {
    transform(value: number, decimals: number) {
        let exp;
        const suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

        if (value === undefined) {
            return null;
        }

        // for whenever we wanna support multiple units
        // exp = Math.floor(Math.log(value) / Math.log(1000));
        exp = 1;

        return (value / Math.pow(1000, exp)).toFixed(decimals) + ' ' + suffixes[exp - 1];
    }
}
