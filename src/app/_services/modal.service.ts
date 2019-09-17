import { Output, EventEmitter } from '@angular/core';
export class ModalService {

  @Output() pop: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-native
  @Output() close: EventEmitter<any> = new EventEmitter();

  popModal(youtubeRef: string) {
    this.pop.emit(youtubeRef);
  }

  closeModal() {
    this.close.emit();
  }
}
