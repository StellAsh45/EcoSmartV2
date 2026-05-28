import { PartialType } from '@nestjs/mapped-types';
import { CreateResultadosExamanDto } from './create-resultados-examan.dto';

export class UpdateResultadosExamanDto extends PartialType(CreateResultadosExamanDto) {}
