import { Global, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service.js';

/** Providers that more than one feature module uses. */
@Global()
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class CommonModule {}
