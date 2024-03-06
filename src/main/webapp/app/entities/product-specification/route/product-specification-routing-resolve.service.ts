import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ProductSpecification } from '../product-specification.model';
import { ProductSpecificationService } from '../service/product-specification.service';

export const productSpecificationResolve = (route: ActivatedRouteSnapshot): Observable<null | ProductSpecification> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProductSpecificationService)
      .find(id)
      .pipe(
        mergeMap((productSpecification: HttpResponse<ProductSpecification>) => {
          if (productSpecification.body) {
            return of(productSpecification.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default productSpecificationResolve;
