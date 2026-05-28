import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CursosModule } from './cursos/cursos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { UploadController } from './upload/upload.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultadosExamenModule } from './resultados-examen/resultados-examen.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Usa ConfigService para leer el .env de forma segura
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),

    // --- CONFIGURACIÓN DE CORREO ---
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"EcoSmart" <no-reply@ecosmart.com>',
        },
      }),
      inject: [ConfigService],
    }),

    UsuariosModule,
    AuthModule,
    CursosModule,
    InscripcionesModule,
    ResultadosExamenModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
