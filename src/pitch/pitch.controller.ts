import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PitchService } from './pitch.service';
import { GeneratePitchDto, SavePitchDto } from './dto/pitch.dto';

@Controller('pitch')
export class PitchController {
  constructor(private readonly pitchService: PitchService) {}

  @Get('tips')
  getTips() {
    return this.pitchService.getTips();
  }

  @Post('generate')
  generate(@Body() dto: GeneratePitchDto) {
    return this.pitchService.generate(dto);
  }

  @Post('save')
  save(@Body() dto: SavePitchDto) {
    return this.pitchService.save(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.pitchService.getByUser(userId);
  }
}
