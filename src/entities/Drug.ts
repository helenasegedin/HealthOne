import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Prescription } from "./Prescription";

@Entity()
export class Drug extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    drugName!: string;

    @Column({type: "varchar", length: 255})
    sideEffects!: string;

    @Column({type: "varchar", length: 255})
    benefits!: string;
    
    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @OneToMany((type) => Prescription, (prescription) => prescription.drug, {cascade: true})
    prescriptions!: Prescription[];
}