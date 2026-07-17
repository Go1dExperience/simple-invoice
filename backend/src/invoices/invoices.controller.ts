import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ListInvoicesQuery } from './dto/list-invoices.dto';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}

  @Get()
  list(@Query() query: ListInvoicesQuery) { return this.invoices.findAll(query); }

  @Get(':id')
  detail(@Param('id') id: string) { return this.invoices.findOne(id); }

  @Post()
  create(@Body() dto: CreateInvoiceDto, @Req() req: { user: { id: string } }) {
    return this.invoices.create(dto, req.user.id);
  }
}
