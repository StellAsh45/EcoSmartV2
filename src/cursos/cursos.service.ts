import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Curso, CursoDocument } from './cursos.schema';

@Injectable()
export class CursosService {
  constructor(@InjectModel(Curso.name) private cursoModel: Model<CursoDocument>) {}

  async findAll(): Promise<Curso[]> {
    return this.cursoModel.find().exec();
  }

  async findOne(id: string): Promise<Curso | null> {
    return this.cursoModel.findById(id).exec();
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
