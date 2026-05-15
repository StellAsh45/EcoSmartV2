import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CursoDocument = Curso & Document;

@Schema({ _id: false })
class Bloque {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  tipo: string;

  @Prop()
  valor: string;

  @Prop({ type: Object })
  meta: Record<string, any>;
}

@Schema({ _id: false })
class Leccion {
  @Prop({ required: true })
  id_leccion: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  orden: number;

  @Prop({ type: [Object] })
  bloques: Bloque[];
}

@Schema({ _id: false })
class Pregunta {
  @Prop({ required: true })
  id_pregunta: string;

  @Prop({ required: true })
  enunciado: string;

  @Prop({ type: [String] })
  opciones: string[];

  @Prop({ required: true })
  respuesta_correcta: number;

  @Prop()
  retroalimentacion: string;
}

@Schema({ _id: false })
class Examen {
  @Prop({ required: true })
  id_examen: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ type: [Object] })
  preguntas: Pregunta[];
}

@Schema({ _id: false })
class Modulo {
  @Prop({ required: true })
  id_modulo: string;

  @Prop({ required: true })
  orden: number;

  @Prop({ required: true })
  titulo: string;

  @Prop({ type: [Object] })
  lecciones: Leccion[];

  @Prop({ type: Object })
  examen: Examen;
}

@Schema({ collection: 'cursos', versionKey: false, timestamps: true })
export class Curso {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  nivel: string;

  @Prop({ default: 'borrador' })
  estado: string;

  @Prop()
  imagen_url: string;

  @Prop({ type: [Object] })
  modulos: Modulo[];
}

export const CursoSchema = SchemaFactory.createForClass(Curso);
