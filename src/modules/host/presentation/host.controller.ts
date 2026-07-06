import { Controller, Get, Param } from '@nestjs/common';
import { HostProfileResponseDto } from '../application/dto/host-profile.response.dto';
import { GetHostProfileUseCase } from '../application/use-cases/get-host-profile.use-case';

@Controller('hosts')
export class HostController {
  constructor(private readonly getHostProfileUseCase: GetHostProfileUseCase) {}

  @Get(':id')
  async profile(@Param('id') id: string): Promise<HostProfileResponseDto> {
    const profile = await this.getHostProfileUseCase.execute(id);
    return HostProfileResponseDto.fromProfile(profile);
  }
}
