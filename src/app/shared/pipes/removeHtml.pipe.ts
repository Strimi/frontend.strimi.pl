import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHtml'
})
export class RemoveHtmlPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return value.replace(/<.*?>/gm, ''); // replace tags
  }
}
