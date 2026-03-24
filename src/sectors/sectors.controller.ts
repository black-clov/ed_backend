import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorSelectionDto } from './dto/create-sector-selection.dto';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Get('options')
  getOptions() {
    return this.sectorsService.getOptions();
  }

  @Post()
  create(@Body() dto: CreateSectorSelectionDto) {
    return this.sectorsService.create(dto);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.sectorsService.getByUser(userId);
  }
}
