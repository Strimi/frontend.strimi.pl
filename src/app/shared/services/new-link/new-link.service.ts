import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RecognizedLink} from '../../models/recognize-link.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NewLinkService {


  recognizedLink = new BehaviorSubject<RecognizedLink>(null);

  constructor() {
  }


  getRecognizedLink(): Observable<RecognizedLink> {
    return this.recognizedLink.asObservable();
  }


}
