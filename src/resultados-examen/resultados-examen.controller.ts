import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ResultadosExamenService } from './resultados-examen.service';

@Controller('resultados-examen')
export class ResultadosExamenController {
  constructor(private readonly resultadosExamenService: ResultadosExamenService) {}

  @Post()
  createOrUpdate(@Body() createDto: any) {
    return this.resultadosExamenService.createOrUpdate(createDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.resultadosExamenService.findAll(query);
  }

  @Delete()
  deleteOne(@Query() query: any) {
    return this.resultadosExamenService.deleteOne(query);
  }
}
