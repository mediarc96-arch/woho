import { TourResponseDto } from '../../../tour/application/dto/tour.response.dto';
import { HostProfile } from '../use-cases/get-host-profile.use-case';

class HostRatingDto {
  average: number;
  count: number;

  constructor(average: number, count: number) {
    this.average = average;
    this.count = count;
  }
}

export class HostProfileResponseDto {
  id: string;
  name: string;
  role: string;
  rating: HostRatingDto;
  tours: TourResponseDto[];

  private constructor(profile: HostProfile) {
    this.id = profile.host.id;
    this.name = profile.host.name;
    this.role = profile.host.role;
    this.rating = new HostRatingDto(profile.rating.average, profile.rating.count);
    this.tours = profile.publishedTours.map((tour) => TourResponseDto.fromEntity(tour));
  }

  static fromProfile(profile: HostProfile): HostProfileResponseDto {
    return new HostProfileResponseDto(profile);
  }
}
