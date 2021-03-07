import { IsEnum, IsString, IsDateString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

export enum SessionStatus {
    ACTIVE = 'ACTIVE',
    LOGOUT = 'LOGOUT'
}

@Entity()
export class Session {
    @Column({ type: 'varchar', length: 64 })
    @PrimaryGeneratedColumn('uuid')
    token?: string;

    @IsEnum(SessionStatus)
    @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.ACTIVE })
    status?: SessionStatus;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    ip?: string;

    @ManyToOne((_) => User, (user) => user.sessions)
    user?: User;

    @IsDateString()
    @Column({ type: 'datetime', nullable: false })
    createdDate?: string;

    @IsDateString()
    @Column({ type: 'datetime', nullable: true })
    updatedDate?: string;

    @IsDateString()
    @Column({ type: 'datetime', nullable: true })
    deletedDate?: string;
}
