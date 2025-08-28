import { User } from '@/entities/core/user';
import { UserProfile } from '@/entities/core/user-profile';

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  role: string;
  lastLoginAt: Date | null;
  profile: UserProfile | null;
  deletedAt?: Date | null;
}

export function userToDTO(user: User): UserDTO {
  return {
    id: user.id.toString(),
    email: user.email.value, // Adapted to access user.email.value
    username: user.username.value,
    role: user.role,
    lastLoginAt: user.lastLoginAt ?? null,
    profile: user.profile ?? null,
    deletedAt: user.deletedAt ?? null,
  };
}
