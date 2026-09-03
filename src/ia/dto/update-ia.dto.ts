import { PartialType } from '@nestjs/mapped-types';
import { ResponderDto } from './responder.dto';

export class UpdateIaDto extends PartialType(ResponderDto) {}
