import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CoilsService } from './coils.service';
import { CreateCoilDto } from './dto/create-coil.dto';
import { UpdateCoilDto } from './dto/update-coil.dto';

@Controller('api/coils')
export class CoilsController {
  constructor(private readonly coilsService: CoilsService) {}

  @Post()
  create(@Body() createCoilDto: CreateCoilDto) {
    return this.coilsService.create(createCoilDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.coilsService.findAll(query);
  }

  @Get('unassigned')
  findUnassigned(@Query('date') date: string) {
    return this.coilsService.findUnassigned(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coilsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCoilDto: UpdateCoilDto) {
    return this.coilsService.update(id, updateCoilDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coilsService.remove(id);
  }
}
