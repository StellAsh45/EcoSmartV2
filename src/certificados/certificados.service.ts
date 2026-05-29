import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import PDFDocument from 'pdfkit';
import { existsSync } from 'fs';
import { join } from 'path';
import { Certificado, CertificadoDocument } from './certificados.schema';
import { Inscripcion, InscripcionDocument } from '../inscripciones/inscripciones.schema';
import { Usuario, UsuarioDocument } from '../usuarios/usuarios.schema';
import { Curso, CursoDocument } from '../cursos/cursos.schema';
import { limpiarNombre } from '../common/utils/nombre.util';

@Injectable()
export class CertificadosService {
  constructor(
    @InjectModel(Certificado.name) private certificadoModel: Model<CertificadoDocument>,
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
  ) {}

  private generarCodigo(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 6; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ECO-${suffix}-${new Date().getFullYear()}`;
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

    const certificado = new this.certificadoModel({
      usuario_id: usuarioId,
      curso_id: cursoId,
      inscripcion_id: inscripcion._id,
      usuario_nombre: limpiarNombre(usuario.nombre) || usuario.correo,
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

  async generarPdf(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const certificado = await this.findOne(id);
    const buffer = await this.buildPdf(certificado);
    const nombreSeguro = (certificado.usuario_correo || certificado.usuario_nombre)
      .replace(/[^a-zA-Z0-9@._-]/g, '');
    const filename = `Certificado-EcoSmart-${nombreSeguro}.pdf`;
    return { buffer, filename };
  }

  private buildPdf(cert: Certificado): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const w = 842.28;
      const h = 595.28;
      const cx = w / 2;

      doc.rect(0, 0, w, h).fill('#020617');

      doc.roundedRect(28, 28, w - 56, h - 56, 10)
        .lineWidth(2)
        .strokeColor('#10f981')
        .stroke();

      doc.roundedRect(38, 38, w - 76, h - 76, 8)
        .lineWidth(0.8)
        .strokeColor('#059669')
        .opacity(0.35)
        .stroke();
      doc.opacity(1);

      const logoPath = join(process.cwd(), 'cliente', 'assets', 'logo.png');
      const headerY = 52;
      if (existsSync(logoPath)) {
        doc.image(logoPath, cx - 95, headerY, { width: 44, height: 44 });
      }

      doc.fillColor('#10f981')
        .font('Helvetica-Bold')
        .fontSize(22)
        .text('EcoSmart', cx - 38, headerY + 4);

      doc.fillColor('#ffffff')
        .font('Helvetica')
        .fontSize(7.5)
        .text('PLATAFORMA DE EDUCACIÓN AMBIENTAL', cx - 38, headerY + 30, {
          characterSpacing: 1.2,
        });

      doc.fillColor('#10f981')
        .font('Helvetica-Bold')
        .fontSize(44)
        .text('CERTIFICADO', 0, 118, { align: 'center', width: w });

      // Estrella con asterisco (Helvetica no soporta bien el carácter ★)
      doc.fillColor('#10f981')
        .font('Helvetica-Bold')
        .fontSize(22)
        .text('*', 0, 168, { align: 'center', width: w });

      doc.fillColor('#cbd5e1')
        .font('Helvetica')
        .fontSize(13)
        .text('La plataforma EcoSmart certifica y hace constar que', 0, 205, {
          align: 'center',
          width: w,
        });

      const nombreMostrar =
        limpiarNombre(cert.usuario_nombre) || cert.usuario_correo;
      doc.fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(nombreMostrar, 80, 240, { align: 'center', width: w - 160 });

      doc.fillColor('#cbd5e1')
        .font('Helvetica')
        .fontSize(12.5)
        .text(
          'Ha cursado y aprobado satisfactoriamente todos los módulos y exámenes del curso de',
          100,
          310,
          { align: 'center', width: w - 200 },
        );

      doc.fillColor('#10f981')
        .font('Helvetica-Bold')
        .fontSize(20)
        .text(`"${cert.curso_titulo}"`, 100, 345, {
          align: 'center',
          width: w - 200,
        });

      const footerY = h - 115;
      const col1 = 90;
      const col3 = w - 210;

      doc.fillColor('#94a3b8')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text('FECHA DE EMISIÓN', col1, footerY, { characterSpacing: 0.8 });

      doc.fillColor('#10f981')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(this.formatearFecha(new Date(cert.fecha_emision)), col1, footerY + 16);

      doc.circle(cx, footerY + 18, 22)
        .lineWidth(1.5)
        .strokeColor('#10f981')
        .stroke();

      // Palomita dibujada (Helvetica no soporta bien ✓)
      doc.save()
        .strokeColor('#10f981')
        .lineWidth(2.5)
        .lineCap('round')
        .lineJoin('round')
        .moveTo(cx - 8, footerY + 18)
        .lineTo(cx - 2, footerY + 24)
        .lineTo(cx + 10, footerY + 8)
        .stroke()
        .restore();

      doc.fillColor('#10f981')
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('CERTIFICADO VERIFICADO', cx - 52, footerY + 48, {
          characterSpacing: 0.6,
        });

      doc.fillColor('#94a3b8')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text('FIRMA AUTORIZADA', col3, footerY, { characterSpacing: 0.8 });

      doc.fillColor('#10f981')
        .font('Helvetica-Oblique')
        .fontSize(22)
        .text('EcoSmart', col3, footerY + 14);

      doc.fillColor('#64748b')
        .font('Helvetica')
        .fontSize(9)
        .text(`ID: ${cert.codigo}`, w - 180, h - 48);

      doc.end();
    });
  }
}
