import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResultadoExamen, ResultadoExamenDocument } from './resultados-examen.schema';

@Injectable()
export class ResultadosExamenService {
  constructor(
    @InjectModel(ResultadoExamen.name) private resultadoModel: Model<ResultadoExamenDocument>,
  ) {}

  async createOrUpdate(createDto: any): Promise<ResultadoExamen> {
    // Buscar si ya existe un resultado previo para este usuario y este examen
    const existing = await this.resultadoModel.findOne({
      usuario_id: new Types.ObjectId(createDto.usuario_id),
      examen_id: createDto.examen_id
    });

    if (existing) {
      // Si existe, actualizamos los datos (porcentaje, respuestas, correctas, incorrectas)
      existing.porcentaje = createDto.porcentaje;
      existing.correctas = createDto.correctas;
      existing.incorrectas = createDto.incorrectas;
      existing.respuestas = createDto.respuestas;
      return existing.save();
    } else {
      // Si no existe, lo creamos nuevo
      const created = new this.resultadoModel({
        usuario_id: new Types.ObjectId(createDto.usuario_id),
        curso_id: new Types.ObjectId(createDto.curso_id),
        examen_id: createDto.examen_id,
        modulo_id: createDto.modulo_id,
        porcentaje: createDto.porcentaje,
        correctas: createDto.correctas,
        incorrectas: createDto.incorrectas,
        respuestas: createDto.respuestas,
      });
      return created.save();
    }
  }

  async findAll(query: any): Promise<ResultadoExamen[]> {
    const filter: any = {};
    if (query.usuario_id) filter.usuario_id = new Types.ObjectId(query.usuario_id);
    if (query.curso_id) filter.curso_id = new Types.ObjectId(query.curso_id);
    return this.resultadoModel.find(filter).exec();
  }
}
