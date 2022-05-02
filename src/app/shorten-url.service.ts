import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { UrlResponse } from './url-response';

@Injectable({
  providedIn: 'root',
})
export class ShortenUrlService {
  stringUrl = 'https://api.shrtco.de/v2/shorten?url=';

  constructor(private http: HttpClient) {}

  shortenUrl(url: string): Observable<UrlResponse> {
    return this.http.get<UrlResponse>(`${this.stringUrl}${url}`).pipe(
      tap((data) => console.log(data)),
      catchError(this.handleError)
    );
  }

  getLinks(): Observable<UrlResponse[]> {
    const urlString = sessionStorage.getItem('urls') || '[]';
    const urls: UrlResponse[] = JSON.parse(urlString);
    return of(urls);
  }

  addLink(link: UrlResponse) {
    let newLinks: UrlResponse[];
    this.getLinks().subscribe((links) => {
      newLinks = links;
      newLinks.push(link);
      sessionStorage.setItem('urls', JSON.stringify(newLinks));
    });
  }

  handleError(err: HttpErrorResponse) {
    let errMsg = '';
    if (err.error instanceof ErrorEvent) {
      errMsg = `Error: ${err.error.message}`;
    } else {
      errMsg = 'Error Status: ${err.status}\nMessage: ${err.message}';
    }
    console.log(errMsg);
    return throwError(() => errMsg);
  }
}
