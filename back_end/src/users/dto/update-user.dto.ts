import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Omitir senha na atualização (será tratada separadamente)
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {} 