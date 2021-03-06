import { IsDateString, IsEnum, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum LetterStatus {
    NOT_READ_BY_SANTA = 'NOT_READ_BY_SANTA',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED',
    DELIVERED = 'DELIVERED'
}

@Entity()
export class Letter {
    @PrimaryGeneratedColumn('uuid')
    id?: number;

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
