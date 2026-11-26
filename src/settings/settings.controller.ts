import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** Public so the "À propos" page also works before login. */
  @Public()
  @Get('about')
  getAbout() {
    return this.settingsService.getAbout();
  }
}
