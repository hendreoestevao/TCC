import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(array: any[], groupBy: string): any[] {
    if (!array || !groupBy) return array;

    const grouped = array.reduce((result, currentValue) => {
      // Pegue o valor do campo para agrupamento (ex: senderId)
      const groupKey = currentValue[groupBy];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});

    return Object.values(grouped);
  }
}
