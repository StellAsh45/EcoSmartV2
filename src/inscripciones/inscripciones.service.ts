import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inscripcion, InscripcionDocument } from './inscripciones.schema';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
  ) { }

  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    const nuevaInscripcion = new this.inscripcionModel(createInscripcionDto);
    return nuevaInscripcion.save();
  }

  async findAll(query: any): Promise<Inscripcion[]> {
    console.log("Backend: Recibiendo query para inscripciones:", query);
    const filter: any = { ...query };

    // Si viene usuario_id, intentamos buscarlo como ObjectId
    if (filter.usuario_id && typeof filter.usuario_id === 'string' && Types.ObjectId.isValid(filter.usuario_id)) {
      const oid = new Types.ObjectId(filter.usuario_id);
      // Buscamos que coincida con el ObjectId O con el string por si acaso
      filter.usuario_id = { $in: [oid, filter.usuario_id] };
    }

    if (filter.curso_id && typeof filter.curso_id === 'string' && Types.ObjectId.isValid(filter.curso_id)) {
      const oid = new Types.ObjectId(filter.curso_id);
      filter.curso_id = { $in: [oid, filter.curso_id] };
    }

    console.log("Backend: Filtro final Mongoose:", JSON.stringify(filter));
    return this.inscripcionModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Inscripcion | null> {
    return this.inscripcionModel.findById(id).exec();
  }
}
