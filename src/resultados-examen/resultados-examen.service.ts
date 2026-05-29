import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResultadoExamen, ResultadoExamenDocument } from './resultados-examen.schema';

@Injectable()
export class ResultadosExamenService {
  constructor(
    @InjectModel(ResultadoExamen.name) private resultadoModel: Model<ResultadoExamenDocument>,
  ) {}

  async createOrUpdate(createDto: any): Promise<ResultadoExamen> {
    const usuarioId = new Types.ObjectId(createDto.usuario_id);
    const cursoId = new Types.ObjectId(createDto.curso_id);

    // Buscar si ya existe un resultado previo para este usuario y este examen
    const existing = await this.resultadoModel.findOne({
      usuario_id: usuarioId,
      curso_id: cursoId,
      examen_id: createDto.examen_id,
    });

    if (existing) {
      // Si existe, actualizamos los datos (porcentaje, respuestas, correctas, incorrectas)
      existing.modulo_id = createDto.modulo_id;
      existing.porcentaje = createDto.porcentaje;
      existing.correctas = createDto.correctas;
      existing.incorrectas = createDto.incorrectas;
      existing.respuestas = createDto.respuestas;
      return existing.save();
    } else {
      // Si no existe, lo creamos nuevo
      const created = new this.resultadoModel({
        usuario_id: usuarioId,
        curso_id: cursoId,
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

  async deleteOne(query: any): Promise<{ deleted: boolean; deletedCount: number }> {
    if (!query.usuario_id || !query.curso_id || !query.examen_id) {
      throw new BadRequestException('usuario_id, curso_id y examen_id son requeridos');
    }

    const result = await this.resultadoModel.deleteOne({
      usuario_id: new Types.ObjectId(query.usuario_id),
      curso_id: new Types.ObjectId(query.curso_id),
      examen_id: query.examen_id,
    });

    return {
      deleted: result.deletedCount > 0,
      deletedCount: result.deletedCount,
    };
  }
}
