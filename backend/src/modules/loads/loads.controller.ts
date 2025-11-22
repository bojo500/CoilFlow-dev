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
import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';

@Controller('api/loads')
export class LoadsController {
  constructor(private readonly loadsService: LoadsService) {}

  @Post()
  create(@Body() createLoadDto: CreateLoadDto) {
    return this.loadsService.create(createLoadDto);
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.loadsService.findAll(date);
  }

  @Get('today')
  findToday() {
    return this.loadsService.findToday();
  }

  @Get('tomorrow')
  findTomorrow() {
    return this.loadsService.findTomorrow();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLoadDto: UpdateLoadDto) {
    return this.loadsService.update(id, updateLoadDto);
  }

  @Post(':id/assign-coil')
  assignCoil(@Param('id') id: string, @Body() body: { coil_id: string }) {
    return this.loadsService.assignCoil(id, body.coil_id);
  }

  @Post(':id/unassign-coil')
  unassignCoil(@Param('id') id: string, @Body() body: { coil_id: string }) {
    return this.loadsService.unassignCoil(id, body.coil_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadsService.remove(id);
  }
}
