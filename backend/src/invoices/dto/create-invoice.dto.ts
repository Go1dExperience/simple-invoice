import { Type } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOnOrAfter } from "./is-on-or-after.validator";

class CustomerDto {
  @ApiProperty() @IsString() @IsNotEmpty() fullname!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
}
class ItemDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsInt() @IsPositive() quantity!: number;
  @ApiProperty() @IsNumber() @IsPositive() rate!: number;
}
export class CreateInvoiceDto {
  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto;
  @ApiProperty() @IsString() @IsNotEmpty() invoiceNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() invoiceReference?: string;
  @ApiProperty({ example: "2026-06-03" }) @IsDateString() invoiceDate!: string;
  @ApiProperty({ example: "2026-07-03" })
  @IsDateString()
  @IsOnOrAfter("invoiceDate", {
    message: "dueDate must be on or after invoiceDate",
  })
  dueDate!: string;
  @ApiProperty({ example: "AUD" }) @IsString() @IsNotEmpty() currency!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ type: ItemDto })
  @ValidateNested()
  @Type(() => ItemDto)
  item!: ItemDto;
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxPercent: number = 10;
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount: number = 0;
}
