import { DataSource } from "typeorm";
import { config } from './config';
import { Patient } from "./entities/Patient"
import { Doctor } from "./entities/Doctor";
import { DoctorHistory } from "./entities/DoctorHistory";
import { Hospital } from "./entities/Hospital";
import { HospitalAffiliation } from "./entities/HospitalAffiliation";
import { InsuranceCompany } from "./entities/InsuranceCompany";
import { OfficeVisit } from "./entities/OfficeVisit";
import { Prescription } from "./entities/Prescription";
import { Drug } from "./entities/Drug";

// database connection configuration
const defaultDataSource = new DataSource({
    type: "mysql",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.db,
    entities: [Patient, Doctor, DoctorHistory, Drug, Hospital, HospitalAffiliation, InsuranceCompany, OfficeVisit, Prescription],
    synchronize: true,
});

// check if database connection can be established
defaultDataSource
  .initialize()
  .then(() => {
    console.log("Database initialized...");
})
  .catch((err) => {
    console.log("Error initializing database", err);
});

export default defaultDataSource;