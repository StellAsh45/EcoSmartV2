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
}
