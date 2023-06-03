import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { HospitalAffiliation } from "./HospitalAffiliation";

@Entity()
export class Hospital extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    name!: string;
    
    @Column({type: "varchar", length: 255})
    address!: string;

    @Column({type: "varchar", length: 20})
    phone!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany((type) => HospitalAffiliation, (hospitalAffiliation) => hospitalAffiliation.hospital, {cascade: true})
    hospitalAffiliations!: HospitalAffiliation[];
}