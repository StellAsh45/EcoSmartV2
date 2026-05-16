import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { Inscripcion, InscripcionSchema } from './inscripciones.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inscripcion.name, schema: InscripcionSchema }]),
  ],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}
