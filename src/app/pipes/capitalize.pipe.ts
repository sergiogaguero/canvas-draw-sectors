import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(value: any, words: boolean) {

    if (value) {
      if (words) {
        const wordList = value.split(' ');
        let result = '';
        for (let i = 0; i < wordList.length; i++) {
          result += wordList[i].charAt(0).toUpperCase() + wordList[i].slice(1).toLowerCase() + ' ';
        }
        return result;
      } else {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
    }

    return value;
  }
}
