import { Column, PrimaryColumn, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity()
export class DoctorHistory extends BaseEntity{
    @PrimaryColumn()
    doctorId!: number;
    @PrimaryColumn()
    patientId!: number;

    @Column()
    startDate!: Date;

    @Column({nullable: true})
    endDate!: Date;

    @Column({type: "varchar", length: 255, nullable: true})
    reasonForLeaving!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne((type) => Patient, (patient) => patient.doctorHistories, {eager:true})
    patient!: Patient;

    @ManyToOne((type) => Doctor, (doctor) => doctor.doctorHistories, {eager:true})
    doctor!: Doctor;
}