import type { UniqueEntityID } from '../domain/unique-entity-id';

export interface UserProfileProps {
  userId: UniqueEntityID;
  name: string;
  surname: string;
  birthday?: Date;
  location: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserProfile {
  private props: UserProfileProps;

  constructor(props: UserProfileProps) {
    this.props = props;
  }

  get userId() {
    return this.props.userId;
  }
  get name() {
    return this.props.name;
  }
  get surname() {
    return this.props.surname;
  }
  get birthday() {
    return this.props.birthday;
  }
  get location() {
    return this.props.location;
  }
  get bio() {
    return this.props.bio;
  }
  get avatarUrl() {
    return this.props.avatarUrl;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
