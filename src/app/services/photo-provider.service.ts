import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoProviderService {
  public photos: Photo[] = [];

  constructor() { }
}

class Photo {
  data: any;
}
