import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { Principal } from '../../auth/presentation/principal';
import { CreateReviewDto } from '../application/dto/create-review.dto';
import { ReviewResponseDto } from '../application/dto/review.response.dto';
import { TourRatingResponseDto } from '../application/dto/tour-rating.response.dto';
import { CreateReviewUseCase } from '../application/use-cases/create-review.use-case';
import { GetTourRatingUseCase } from '../application/use-cases/get-tour-rating.use-case';
import { GetTourReviewsUseCase } from '../application/use-cases/get-tour-reviews.use-case';

@Controller()
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getTourReviewsUseCase: GetTourReviewsUseCase,
    private readonly getTourRatingUseCase: GetTourRatingUseCase,
  ) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: Principal,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.createReviewUseCase.execute({ ...dto, authorId: user.userId });
    return ReviewResponseDto.fromEntity(review);
  }

  @Get('reviews')
  async listByTour(@Query('tourId') tourId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.getTourReviewsUseCase.execute(tourId);
    return reviews.map((review) => ReviewResponseDto.fromEntity(review));
  }

  @Get('tours/:tourId/rating')
  async tourRating(@Param('tourId') tourId: string): Promise<TourRatingResponseDto> {
    const summary = await this.getTourRatingUseCase.execute(tourId);
    return TourRatingResponseDto.fromSummary(summary);
  }
}
