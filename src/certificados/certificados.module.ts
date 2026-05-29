import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificadosController } from './certificados.controller';
import { CertificadosService } from './certificados.service';
import { Certificado, CertificadoSchema } from './certificados.schema';
import { Inscripcion, InscripcionSchema } from '../inscripciones/inscripciones.schema';
import { Usuario, UsuarioSchema } from '../usuarios/usuarios.schema';
import { Curso, CursoSchema } from '../cursos/cursos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificado.name, schema: CertificadoSchema },
      { name: Inscripcion.name, schema: InscripcionSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Curso.name, schema: CursoSchema },
    ]),
  ],
  controllers: [CertificadosController],
  providers: [CertificadosService],
  exports: [CertificadosService],
})
export class CertificadosModule {}
