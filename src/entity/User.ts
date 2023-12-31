import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../types/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Roles.CUSTOMER })
  role: Roles;
}
