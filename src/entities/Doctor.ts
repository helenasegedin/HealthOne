import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, Timestamp, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Patient } from "./Patient";

// Entity dekoraator ütleb TypeORMile, kuidas sellest tabel teha ja millised väljad on olemas
@Entity()
export class Doctor extends BaseEntity{
    @PrimaryGeneratedColumn()
    doctorId!: number;

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

    @OneToMany((type) => Patient, (patient) => patient.doctor)
    patients!: Patient[];
    
    @OneToMany((type) => Patient, (patient) => patient.doctor)
    patients!: Patient[];
    
    @OneToMany((type) => Patient, (patient) => patient.doctor)
    patients!: Patient[];
    
    @OneToMany((type) => Patient, (patient) => patient.doctor)
    patients!: Patient[];
}