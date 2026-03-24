import { Controller, Get, Param, Query } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.videosService.findAll(category);
  }

  @Get('categories')
  getCategories() {
    return this.videosService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }
}
