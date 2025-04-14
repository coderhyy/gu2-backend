import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsentFormsService } from './consent-forms.service';
import { CreateConsentFormDto } from './dto/create-consent-form.dto';
import { UpdateConsentFormDto } from './dto/update-consent-form.dto';

@Controller('consent-forms')
export class ConsentFormsController {
  constructor(private readonly consentFormsService: ConsentFormsService) {}

  @Post()
  create(@Body() createConsentFormDto: CreateConsentFormDto) {
    return this.consentFormsService.create(createConsentFormDto);
  }

  @Get()
  findAll() {
    return this.consentFormsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consentFormsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsentFormDto: UpdateConsentFormDto) {
    return this.consentFormsService.update(+id, updateConsentFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consentFormsService.remove(+id);
  }
}
