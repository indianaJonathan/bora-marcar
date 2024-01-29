export class UserDto {
  id?: string;
  name: string;
  email: string;
  enc_pass?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
}
