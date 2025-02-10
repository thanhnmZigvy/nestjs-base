import { Injectable } from '@nestjs/common';

import { getCurrentUser } from './utils/request-context';
@Injectable()
export class AppService {
  getHello(): string {
    console.log(getCurrentUser());
    return 'Hello World!';
  }
}
