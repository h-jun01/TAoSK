import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class NewCompanyInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}
