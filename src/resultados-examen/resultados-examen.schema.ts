import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultadoExamenDocument = ResultadoExamen & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class ResultadoExamen {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Curso', required: true })
  curso_id: Types.ObjectId;

  @Prop({ required: true })
  examen_id: string;

  @Prop({ required: true })
  modulo_id: string;

  @Prop({ required: true })
  porcentaje: number;

  @Prop({ required: true })
  correctas: number;

  @Prop({ required: true })
  incorrectas: number;

  @Prop({ type: [{ pregunta_id: String, respuesta_estudiante: Number, es_correcta: Boolean }] })
  respuestas: Record<string, any>[];
}

export const ResultadoExamenSchema = SchemaFactory.createForClass(ResultadoExamen);
