import { IsDateString, IsEnum, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { User } from './User';

export enum LetterStatus {
    NOT_READ_BY_SANTA = 'NOT_READ_BY_SANTA',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED',
    DELIVERED = 'DELIVERED'
}

@Entity()
export class Letter {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @IsString({ always: true })
    @Column({ type: 'varchar', length: 100, nullable: false })
    title?: string;

    @IsString({ always: true })
    @Column({ type: 'text', nullable: false })
    description?: string;

    @IsEnum(LetterStatus)
    @Column({
        type: 'enum',
        enum: LetterStatus,
        default: LetterStatus.NOT_READ_BY_SANTA,
        nullable: false
    })
    status?: LetterStatus;

    @ManyToOne((_) => User, (user) => user.letters, { onDelete: 'CASCADE' })
    user?: User;

    @IsDateString()
    @Column({ type: 'datetime', nullable: false })
    createdDate?: string;

    @IsDateString()
    @Column({ type: 'datetime', nullable: true })
    updatedDate?: string;

    @IsDateString()
    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deletedDate?: string;
}
