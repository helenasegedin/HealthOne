import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";
import { Drug } from "./Drug"

@Entity()
export class Prescription extends BaseEntity{
    @PrimaryGeneratedColumn()
    rxId!: number;

    @Column()
    datePrescribed!: Date;

    @Column({type: "varchar", length: 20})
    dosage!: string;

    @Column()
    duration!: Date;

    @Column()
    refillable!: Boolean;
    
    @Column({nullable:true})
    refillNo!: number;
    
    @Column({type: "varchar", length: 255, nullable:true})
    comments!: string;
    
    @Column({type: "varchar", length: 255, nullable:true})
    nonRefillReason!: string;

    @Column()
    patientId!: number;

    @Column()
    doctorId!: number;

    @Column()
    drugId!: number;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @ManyToOne((type) => Patient, (patient) => patient.prescriptions, {eager: true})
    patient!: Patient;

    @ManyToOne((type) => Doctor, (doctor) => doctor.prescriptions, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Drug, (drug) => drug.prescriptions, {eager: true})
    drug!: Drug;
}