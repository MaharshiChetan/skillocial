import { NgModule } from '@angular/core';
import { ChatDatePipe } from './chat-date/chat-date.pipe';

@NgModule({
  declarations: [ChatDatePipe],
  imports: [],
  exports: [ChatDatePipe],
})
export class PipesModule {}
