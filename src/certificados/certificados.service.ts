import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Certificado, CertificadoDocument } from './certificados.schema';
import { Inscripcion, InscripcionDocument } from '../inscripciones/inscripciones.schema';
import { Usuario, UsuarioDocument } from '../usuarios/usuarios.schema';
import { Curso, CursoDocument } from '../cursos/cursos.schema';

@Injectable()
export class CertificadosService {
  constructor(
    @InjectModel(Certificado.name) private certificadoModel: Model<CertificadoDocument>,
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
  ) { }

  private generarCodigo(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 6; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ECO-${suffix}-${new Date().getFullYear()}`;
  }

  /** Elimina el apellido "undefined" que puede quedar si el registro fue incompleto */
  private normalizarNombre(nombre: string): string {
    return (nombre || '')
      .replace(/\bundefined\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private estaCompletada(inscripcion: Inscripcion): boolean {
    return (
      inscripcion.progreso_porcentaje >= 100 ||
      inscripcion.estado_curso === 'completado'
    );
  }

  async emitirParaInscripcion(inscripcion: InscripcionDocument): Promise<Certificado | null> {
    if (!this.estaCompletada(inscripcion)) return null;

    const usuarioId = inscripcion.usuario_id;
    const cursoId = inscripcion.curso_id;

    const existente = await this.certificadoModel
      .findOne({ usuario_id: usuarioId, curso_id: cursoId })
      .exec();
    if (existente) return existente;

    const [usuario, curso] = await Promise.all([
      this.usuarioModel.findById(usuarioId).exec(),
      this.cursoModel.findById(cursoId).exec(),
    ]);

    if (!usuario || !curso) return null;

    const nombreLimpio = this.normalizarNombre(usuario.nombre) || usuario.correo;

    const certificado = new this.certificadoModel({
      usuario_id: usuarioId,
      curso_id: cursoId,
      inscripcion_id: inscripcion._id,
      usuario_nombre: nombreLimpio,
      usuario_correo: usuario.correo,
      curso_titulo: curso.titulo,
      codigo: this.generarCodigo(),
      fecha_emision: new Date(),
    });

    return certificado.save();
  }

  async emitirSiCompletada(inscripcionId: string): Promise<Certificado | null> {
    const inscripcion = await this.inscripcionModel.findById(inscripcionId).exec();
    if (!inscripcion) return null;
    return this.emitirParaInscripcion(inscripcion);
  }

  async sincronizarUsuario(usuarioId: string): Promise<void> {
    if (!Types.ObjectId.isValid(usuarioId)) return;

    const oid = new Types.ObjectId(usuarioId);
    const inscripciones = await this.inscripcionModel
      .find({
        usuario_id: { $in: [oid, usuarioId] },
        $or: [{ progreso_porcentaje: { $gte: 100 } }, { estado_curso: 'completado' }],
      })
      .exec();

    for (const inscripcion of inscripciones) {
      await this.emitirParaInscripcion(inscripcion);
    }
  }

  async findAll(usuarioId: string): Promise<Certificado[]> {
    await this.sincronizarUsuario(usuarioId);

    const oid = Types.ObjectId.isValid(usuarioId)
      ? new Types.ObjectId(usuarioId)
      : usuarioId;

    return this.certificadoModel
      .find({ usuario_id: { $in: [oid, usuarioId] } })
      .sort({ fecha_emision: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Certificado> {
    const certificado = await this.certificadoModel.findById(id).exec();
    if (!certificado) {
      throw new NotFoundException(`Certificado #${id} no encontrado`);
    }
    return certificado;
  }

  async findByCurso(usuarioId: string, cursoId: string): Promise<Certificado | null> {
    await this.sincronizarUsuario(usuarioId);

    const usuarioOid = Types.ObjectId.isValid(usuarioId)
      ? new Types.ObjectId(usuarioId)
      : usuarioId;
    const cursoOid = Types.ObjectId.isValid(cursoId)
      ? new Types.ObjectId(cursoId)
      : cursoId;

    return this.certificadoModel
      .findOne({
        usuario_id: { $in: [usuarioOid, usuarioId] },
        curso_id: { $in: [cursoOid, cursoId] },
      })
      .exec();
  }
}
