import { PrimaryColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { Doctor } from "./Doctor";
import { Patient } from "./Patient";

@Entity()
export class OfficeVisit extends BaseEntity{
    @PrimaryColumn()
    patientId!: number;

    @PrimaryColumn()
    doctorId!: number;

    @PrimaryColumn()
    visitDate!: Date;

    @Column({type: "text", nullable: true})
    symptoms!: string;

    @Column()
    initialVisit!: Boolean;

    @Column({type: "text", nullable: true})
    initialDiagnosis!: string;
    
    @Column()
    followupVisit!: Boolean;

    @Column({type: "text", nullable: true})
    diagnosisStatus!: string;

    @Column()
    routineVisit!: Boolean;

    @Column({type: "text", nullable: true})
    bloodPressure!: string;
    
    @Column({nullable: true})
    height!: number;

    @Column({nullable: true})
    weight!: number;

    @Column({type: "text", nullable: true})
    diagnosis!: string;

    @Column()
    otherVisit!: Boolean;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @ManyToOne((type) => Doctor, (doctor) => doctor.officeVisits, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => Patient, (patient) => patient.officeVisits, {eager: true})
    patient!: Patient;
}