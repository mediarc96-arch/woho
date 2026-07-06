import { Entity } from '../../../../shared/domain/entity.base';
import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../../shared/domain/value-objects/money.vo';

export enum TourCategory {
  FOOD = 'FOOD',
  CULTURE = 'CULTURE',
  NIGHTLIFE = 'NIGHTLIFE',
  NATURE = 'NATURE',
  SHOPPING = 'SHOPPING',
  HISTORY = 'HISTORY',
}

export enum AfterTourOption {
  MEAL = 'MEAL',
  DRINKS = 'DRINKS',
  CAFE = 'CAFE',
}

export enum TourStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface TourProps {
  hostId: string;
  title: string;
  description: string;
  category: TourCategory;
  city: string;
  price: Money;
  durationMinutes: number;
  meetingPoint: string;
  afterTourOptions: AfterTourOption[];
  status: TourStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTourProps {
  hostId: string;
  title: string;
  description: string;
  category: TourCategory;
  city: string;
  price: Money;
  durationMinutes: number;
  meetingPoint: string;
  afterTourOptions?: AfterTourOption[];
}

export class Tour extends Entity<TourProps> {
  private constructor(id: string, props: TourProps) {
    super(id, props);
  }

  static create(id: string, props: CreateTourProps): Tour {
    if (props.title.trim().length === 0) {
      throw new InvalidArgumentException('Tour title cannot be empty');
    }
    if (props.durationMinutes <= 0) {
      throw new InvalidArgumentException('Tour duration must be greater than zero');
    }

    const now = new Date();
    return new Tour(id, {
      hostId: props.hostId,
      title: props.title.trim(),
      description: props.description,
      category: props.category,
      city: props.city,
      price: props.price,
      durationMinutes: props.durationMinutes,
      meetingPoint: props.meetingPoint,
      afterTourOptions: props.afterTourOptions ?? [],
      status: TourStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, props: TourProps): Tour {
    return new Tour(id, props);
  }

  publish(): void {
    this.props.status = TourStatus.PUBLISHED;
    this.props.updatedAt = new Date();
  }

  archive(): void {
    this.props.status = TourStatus.ARCHIVED;
    this.props.updatedAt = new Date();
  }

  get hostId(): string {
    return this.props.hostId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get category(): TourCategory {
    return this.props.category;
  }

  get city(): string {
    return this.props.city;
  }

  get price(): Money {
    return this.props.price;
  }

  get durationMinutes(): number {
    return this.props.durationMinutes;
  }

  get meetingPoint(): string {
    return this.props.meetingPoint;
  }

  get afterTourOptions(): AfterTourOption[] {
    return this.props.afterTourOptions;
  }

  get status(): TourStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
