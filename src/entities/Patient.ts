import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Doctor } from "./Doctor";
import { InsuranceCompany } from "./InsuranceCompany";
import { Prescription } from "./Prescription";
import { DoctorHistory } from "./DoctorHistory";
import { OfficeVisit } from "./OfficeVisit";

@Entity()
export class Patient extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    name!: string;

    @Column({type: "varchar", length: 255})
    address!: string;
    
    @Column({type: "varchar", length: 20})
    phone!: string;

    @Column({type: "varchar", length: 255})
    email!: string;
    
    @Column({nullable: true})
    insuranceOwnerId!: number;

    @Column()
    relationship!: string;
    
    @Column()
    doctorId!: number;

    @Column()
    insuranceId!: number;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne((type) => Patient, (patient) => patient.dependents)
    @JoinColumn({ name: 'insuranceOwnerId' })
    insuranceOwner!: Patient;
  
    @OneToMany((type) => Patient, (patient) => patient.insuranceOwner)
    dependents!: Patient[];
    
    @ManyToOne((type) => Doctor, (doctor) => doctor.patients, {eager: true})
    doctor!: Doctor;

    @ManyToOne((type) => InsuranceCompany, (insuranceCompany) => insuranceCompany.patients)
    insuranceCompany!: InsuranceCompany;

    @OneToMany((type) => Prescription, (prescription) => prescription.patient, {cascade: true})
    prescriptions!: Prescription[];

    @OneToMany((type) => DoctorHistory, (doctorHistory) => doctorHistory.patient)
    doctorHistories!: DoctorHistory[];

    @OneToMany((type) => OfficeVisit, (officeVisit) => officeVisit.patient, {cascade: true})
    officeVisits!: OfficeVisit[];
}