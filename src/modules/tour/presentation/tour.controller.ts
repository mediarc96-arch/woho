import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../../user/domain/entities/user.entity';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/presentation/guards/roles.guard';
import { Principal } from '../../auth/presentation/principal';
import { CreateTourDto } from '../application/dto/create-tour.dto';
import { ListToursQueryDto } from '../application/dto/list-tours.query.dto';
import { TourResponseDto } from '../application/dto/tour.response.dto';
import { CreateTourUseCase } from '../application/use-cases/create-tour.use-case';
import { GetTourUseCase } from '../application/use-cases/get-tour.use-case';
import { ListToursUseCase } from '../application/use-cases/list-tours.use-case';
import { PublishTourUseCase } from '../application/use-cases/publish-tour.use-case';

@Controller('tours')
export class TourController {
  constructor(
    private readonly createTourUseCase: CreateTourUseCase,
    private readonly getTourUseCase: GetTourUseCase,
    private readonly listToursUseCase: ListToursUseCase,
    private readonly publishTourUseCase: PublishTourUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  async create(
    @CurrentUser() user: Principal,
    @Body() dto: CreateTourDto,
  ): Promise<TourResponseDto> {
    const tour = await this.createTourUseCase.execute({ ...dto, hostId: user.userId });
    return TourResponseDto.fromEntity(tour);
  }

  @Get()
  async findAll(@Query() query: ListToursQueryDto): Promise<TourResponseDto[]> {
    const tours = await this.listToursUseCase.execute(query);
    return tours.map((tour) => TourResponseDto.fromEntity(tour));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TourResponseDto> {
    const tour = await this.getTourUseCase.execute(id);
    return TourResponseDto.fromEntity(tour);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  async publish(@CurrentUser() user: Principal, @Param('id') id: string): Promise<TourResponseDto> {
    const tour = await this.publishTourUseCase.execute({ tourId: id, actorId: user.userId });
    return TourResponseDto.fromEntity(tour);
  }
}
