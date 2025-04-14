import { Injectable } from '@nestjs/common';
import { CreateConsentFormDto } from './dto/create-consent-form.dto';
import { UpdateConsentFormDto } from './dto/update-consent-form.dto';

@Injectable()
export class ConsentFormsService {
  create(createConsentFormDto: CreateConsentFormDto) {
    return 'This action adds a new consentForm';
  }

  findAll() {
    return `This action returns all consentForms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consentForm`;
  }

  update(id: number, updateConsentFormDto: UpdateConsentFormDto) {
    return `This action updates a #${id} consentForm`;
  }

  remove(id: number) {
    return `This action removes a #${id} consentForm`;
  }
}
