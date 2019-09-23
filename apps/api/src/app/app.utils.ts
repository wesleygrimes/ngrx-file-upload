import { from } from 'rxjs';
import { delay } from 'rxjs/operators';

export const wait = async (timeout = 2000) =>
  await from([])
    .pipe(delay(timeout))
    .toPromise();
