import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Doctor } from "./Doctor";

// Entity dekoraator ütleb TypeORMile, kuidas sellest tabel teha ja millised väljad on olemas

@Entity()
export class Patient extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    // Column dekoraator kirjeldab andmebaasile veergu, ilma selleta andmebaasi veergu pole
    @Column({type: "varchar", length: 200})
    title!: string;

    @Column({type: "text"})
    body!: string;
    
    @Column({type: "number"})
    patientId!: number;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @ManyToOne((type) => Doctor, (doctor) => doctor.patients, {eager: true})
    doctor!: Doctor;
}