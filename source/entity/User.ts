import { IsDateString, IsEnum, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Session } from './Session';
import bcrypt from 'bcrypt';

export enum UserRole {
    SANTA = 'SANTA',
    CHILD = 'CHILD'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @IsString({ always: true })
    @Column({ type: 'varchar', length: 25, nullable: false, unique: true })
    username?: string;

    @IsString({ always: true })
    @Column({ type: 'varchar', length: 255, nullable: false })
    passwordHash?: string;

    @IsEnum(UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CHILD,
        nullable: false
    })
    role?: UserRole;

    @OneToMany((_) => Session, (session) => session.user, { onDelete: 'CASCADE' })
    sessions?: Session[];

    @IsDateString()
    @Column({ type: 'datetime', nullable: false })
    createdDate?: string;

    @IsDateString()
    @Column({ type: 'datetime', nullable: true })
    updatedDate?: string;

    @IsDateString()
    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deletedDate?: string;

    async checkPassword(password: string): Promise<string | boolean | undefined> {
        return this.passwordHash && (await bcrypt.compare(password, this.passwordHash));
    }
}
