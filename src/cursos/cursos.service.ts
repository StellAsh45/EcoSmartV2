import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curso, CursoDocument } from './cursos.schema';
import { Inscripcion, InscripcionDocument } from '../inscripciones/inscripciones.schema';

@Injectable()
export class CursosService {
  constructor(
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    const cursos = await this.cursoModel.find().lean().exec();
    const cursosConConteo = await Promise.all(
      cursos.map(async (c: any) => {
        const filter: any = {};
        if (c._id && typeof c._id === 'string' && Types.ObjectId.isValid(c._id)) {
          filter.curso_id = { $in: [new Types.ObjectId(c._id), c._id] };
        } else if (c._id && typeof c._id === 'object' && Types.ObjectId.isValid(c._id.toString())) {
          filter.curso_id = { $in: [c._id, c._id.toString()] };
        } else {
          filter.curso_id = c._id;
        }
        const count = await this.inscripcionModel.countDocuments(filter).exec();
        return { ...c, totalEstudiantes: count };
      }),
    );
    return cursosConConteo;
  }

  async findPublished(): Promise<any[]> {
    const cursos = await this.cursoModel.find({ estado: 'publicado' }).lean().exec();
    const cursosConConteo = await Promise.all(
      cursos.map(async (c: any) => {
        const filter: any = {};
        if (c._id && typeof c._id === 'string' && Types.ObjectId.isValid(c._id)) {
          filter.curso_id = { $in: [new Types.ObjectId(c._id), c._id] };
        } else if (c._id && typeof c._id === 'object' && Types.ObjectId.isValid(c._id.toString())) {
          filter.curso_id = { $in: [c._id, c._id.toString()] };
        } else {
          filter.curso_id = c._id;
        }
        const count = await this.inscripcionModel.countDocuments(filter).exec();
        return { ...c, totalEstudiantes: count };
      }),
    );
    return cursosConConteo;
  }

  async findOne(id: string): Promise<any | null> {
    const curso = await this.cursoModel.findById(id).lean().exec();
    if (!curso) return null;
    const filter: any = {};
    if (curso._id && typeof curso._id === 'string' && Types.ObjectId.isValid(curso._id)) {
      filter.curso_id = { $in: [new Types.ObjectId(curso._id), curso._id] };
    } else if (curso._id && typeof curso._id === 'object' && Types.ObjectId.isValid(curso._id.toString())) {
      filter.curso_id = { $in: [curso._id, curso._id.toString()] };
    } else {
      filter.curso_id = curso._id;
    }
    const count = await this.inscripcionModel.countDocuments(filter).exec();
    return { ...curso, totalEstudiantes: count };
  }

  async findOnePublished(id: string): Promise<any | null> {
    const curso = await this.cursoModel.findOne({ _id: id, estado: 'publicado' }).lean().exec();
    if (!curso) return null;
    const filter: any = {};
    if (curso._id && typeof curso._id === 'string' && Types.ObjectId.isValid(curso._id)) {
      filter.curso_id = { $in: [new Types.ObjectId(curso._id), curso._id] };
    } else if (curso._id && typeof curso._id === 'object' && Types.ObjectId.isValid(curso._id.toString())) {
      filter.curso_id = { $in: [curso._id, curso._id.toString()] };
    } else {
      filter.curso_id = curso._id;
    }
    const count = await this.inscripcionModel.countDocuments(filter).exec();
    return { ...curso, totalEstudiantes: count };
  }

  async countInscripcionesForCourse(id: string) {
    const filter: any = {};
    if (id && typeof id === 'string' && Types.ObjectId.isValid(id)) {
      filter.curso_id = { $in: [new Types.ObjectId(id), id] };
    } else {
      filter.curso_id = id;
    }
    const count = await this.inscripcionModel.countDocuments(filter).exec();
    const muestras = await this.inscripcionModel.find(filter).limit(5).lean().exec();
    return { count, muestras };
  }

  async update(id: string, updateData: any): Promise<Curso | null> {
    return this.cursoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async create(createData: any): Promise<Curso> {
    const nuevoCurso = new this.cursoModel(createData);
    return nuevoCurso.save();
  }

  async delete(id: string): Promise<Curso | null> {
    return this.cursoModel.findByIdAndDelete(id).exec();
  }
}
