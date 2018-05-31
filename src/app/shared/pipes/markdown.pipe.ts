import { Pipe, PipeTransform } from '@angular/core';
import * as Remarkable from 'remarkable';
@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  remarkable = new Remarkable({
    html: true, // remarkable renders first then sanitize runs...
    breaks: true,
    linkify: false, // linkify is done locally
    typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
    quotes: '“”‘’',
  });
  transform(value: string, args?: any): any {
    return this.remarkable.render(value);
  }
}
