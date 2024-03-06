import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { EhcClient } from '../ehc-client.model';
import { EhcClientService } from '../service/ehc-client.service';

export const ehcClientResolve = (route: ActivatedRouteSnapshot): Observable<null | EhcClient> => {
  const id = route.params['id'];
  if (id) {
    return inject(EhcClientService)
      .find(id)
      .pipe(
        mergeMap((ehcClient: HttpResponse<EhcClient>) => {
          if (ehcClient.body) {
            return of(ehcClient.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default ehcClientResolve;
