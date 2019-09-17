import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/

@Pipe({
  name: 'momentDuration'
})
export class DurationToTimePipe implements PipeTransform {
  transform(value: string, format: string): string {
    return moment.duration(value).format(format || 'mm:ss', {trim: false});
  }
}
