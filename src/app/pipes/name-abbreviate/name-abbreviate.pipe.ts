import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameAbbreviate'
})
export class NameAbbreviatePipe implements PipeTransform {
  transform(fullName: string): string {
    const names: string[] = fullName.trim().split(' ');
    const abbreviatedNames = names.map(name => name.length > 0 ? name[0] : '');
    return abbreviatedNames.join();
  }
}
