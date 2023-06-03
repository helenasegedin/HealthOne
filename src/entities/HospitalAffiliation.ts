import { PrimaryColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Hospital } from "./Hospital";
import { Doctor } from "./Doctor";

@Entity()
export class HospitalAffiliation extends BaseEntity{
    @PrimaryColumn()
    doctorId!: number;
    
    @PrimaryColumn()
    hospitalId!: number;

    @Column()
    affiliationDate!: Date;
  
    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne((type) => Doctor, (doctor) => doctor.hospitalAffiliations, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Hospital, (hospital) => hospital.hospitalAffiliations, {eager: true})
    hospital!: Hospital;
}