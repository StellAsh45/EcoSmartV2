import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultadosExamenService } from './resultados-examen.service';
import { ResultadosExamenController } from './resultados-examen.controller';
import { ResultadoExamen, ResultadoExamenSchema } from './resultados-examen.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResultadoExamen.name, schema: ResultadoExamenSchema }])
  ],
  controllers: [ResultadosExamenController],
  providers: [ResultadosExamenService],
})
export class ResultadosExamenModule {}
