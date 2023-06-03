import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Patient } from "./Patient";

@Entity()
export class InsuranceCompany extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    name!: string;

    @Column({type: "varchar", length: 20})
    phone!: string;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @OneToMany((type) => Patient, (patient) => patient.insuranceCompany)
    patients!: Patient[];
}