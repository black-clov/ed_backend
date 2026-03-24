import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CvService } from './cv.service';
import { GenerateCvDto } from './dto/generate-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('generate')
  generate(@Body() dto: GenerateCvDto) {
    return this.cvService.generate(dto);
  }

  @Post('pdf')
  async generatePdf(@Body() dto: GenerateCvDto, @Res() res: Response) {
    const pdfBuffer = await this.cvService.generatePdf(dto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cv.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
