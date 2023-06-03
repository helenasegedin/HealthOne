import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Patient } from "./Patient";
import { Prescription } from "./Prescription";
import { DoctorHistory } from "./DoctorHistory";
import { HospitalAffiliation } from "./HospitalAffiliation";
import { OfficeVisit } from "./OfficeVisit";

@Entity()
export class Doctor extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    name!: string;
    
    @Column({type: "varchar", length: 255})
    address!: string;

    @Column({type: "varchar", length: 20})
    phone!: string;

    @Column({type: "varchar", length: 255})
    specialization!: string;

    @Column({type: "varchar", length: 255})
    hospitalAffiliation!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany((type) => Patient, (patient) => patient.doctor)
    patients!: Patient[];

    @OneToMany((type) => Prescription, (prescription) => prescription.doctor)
    prescriptions!: Prescription[];

    @OneToMany((type) => DoctorHistory, (doctorHistory) => doctorHistory.doctor)
    doctorHistories!: DoctorHistory[];

    @OneToMany((type) => HospitalAffiliation, (hospitalAffiliation) => hospitalAffiliation.doctor, {cascade: true})
    hospitalAffiliations!: HospitalAffiliation[];

    @OneToMany((type) => OfficeVisit, (officeVisit) => officeVisit.doctor, {cascade: true})
    officeVisits!: OfficeVisit[];
}