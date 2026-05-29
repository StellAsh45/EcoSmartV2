import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inscripcion, InscripcionDocument } from './inscripciones.schema';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { CertificadosService } from '../certificados/certificados.service';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
    private readonly certificadosService: CertificadosService,
  ) { }

  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    const nuevaInscripcion = new this.inscripcionModel(createInscripcionDto);
    return nuevaInscripcion.save();
  }

  async findAll(query: any): Promise<Inscripcion[]> {
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

    return this.inscripcionModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Inscripcion | null> {
    return this.inscripcionModel.findById(id).exec();
  }

  async update(id: string, updateData: any): Promise<Inscripcion | null> {
    const inscripcion = await this.inscripcionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (inscripcion) {
      await this.certificadosService.emitirParaInscripcion(inscripcion);
    }

    return inscripcion;
  }
}
