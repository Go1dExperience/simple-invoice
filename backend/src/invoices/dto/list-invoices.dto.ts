import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  IsDateString,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListInvoicesQuery {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;
  @ApiPropertyOptional({ enum: ["invoiceDate", "dueDate", "totalAmount"] })
  @IsOptional()
  @IsIn(["invoiceDate", "dueDate", "totalAmount"])
  sortBy: "invoiceDate" | "dueDate" | "totalAmount" = "invoiceDate";
  @ApiPropertyOptional({ enum: ["ASC", "DESC"] })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  ordering: "ASC" | "DESC" = "DESC";
  @ApiPropertyOptional({ enum: ["Draft", "Pending", "Paid", "Overdue"] })
  @IsOptional()
  @IsIn(["Draft", "Pending", "Paid", "Overdue"])
  status?: "Draft" | "Pending" | "Paid" | "Overdue";
  @ApiPropertyOptional() @IsOptional() @IsString() keyword?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() fromDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() toDate?: string;
}
