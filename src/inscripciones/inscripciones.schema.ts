import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InscripcionDocument = Inscripcion & Document;

@Schema({ _id: false })
class ExamenResultado {
  @Prop()
  calificacion_mas_alta: number;

  @Prop()
  estado: string;
}

@Schema({ collection: 'inscripciones', versionKey: false, timestamps: true })
export class Inscripcion {
  @Prop({ type: Types.ObjectId, required: true })
  usuario_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  curso_id: Types.ObjectId;

  @Prop({ default: Date.now })
  fecha_inicio: Date;

  @Prop({ default: 0 })
  progreso_porcentaje: number;

  @Prop({ type: Object })
  examen: ExamenResultado;

  @Prop({ default: 'en progreso' })
  estado_curso: string;
}

export const InscripcionSchema = SchemaFactory.createForClass(Inscripcion);
