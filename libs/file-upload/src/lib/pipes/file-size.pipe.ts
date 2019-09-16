import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value && !isNaN(value)) {
      return `${value / 1024}`;
    }
    return value;
  }
}
