import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificadoDocument = Certificado & Document;

@Schema({ collection: 'certificados', versionKey: false, timestamps: true })
export class Certificado {
  @Prop({ type: Types.ObjectId, required: true })
  usuario_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  curso_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  inscripcion_id: Types.ObjectId;

  @Prop({ required: true })
  usuario_nombre: string;

  @Prop({ required: true })
  usuario_correo: string;

  @Prop({ required: true })
  curso_titulo: string;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ default: Date.now })
  fecha_emision: Date;
}

export const CertificadoSchema = SchemaFactory.createForClass(Certificado);
CertificadoSchema.index({ usuario_id: 1, curso_id: 1 }, { unique: true });
