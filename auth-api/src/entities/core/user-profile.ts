import { Entity } from '../domain/entities';
import type { UniqueEntityID } from '../domain/unique-entity-id';
import type { Url } from './value-objects/url';

export interface UserProfileProps {
  userId: UniqueEntityID;
  name: string;
  surname: string;
  birthday?: Date;
  location: string;
  bio: string;
  avatarUrl: Url;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserProfile extends Entity<UserProfileProps> {
  get userId(): UniqueEntityID {
    return this.props.userId;
  }
  get name(): string {
    return this.props.name;
  }
  get surname(): string {
    return this.props.surname;
  }
  get birthday(): Date | undefined {
    return this.props.birthday;
  }
  get location(): string {
    return this.props.location;
  }
  get bio(): string {
    return this.props.bio;
  }
  get avatarUrl(): Url {
    return this.props.avatarUrl;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: UserProfileProps, id?: UniqueEntityID) {
    return new UserProfile(props, id);
  }
}
