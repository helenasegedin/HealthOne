import express from 'express';
import patientsRouter from "./routes/patients.router";
import doctorsRouter from "./routes/doctors.router";
import doctorHistoriesRouter from "./routes/doctorHistories.router";
import drugsRouter from "./routes/drugs.router";
import hospitalAffiliationsRouter from "./routes/hospitalAffiliations.router";
import hospitalsRouter from "./routes/hospitals.router";
import insuranceCompaniesRouter from "./routes/insuranceCompanies.router";
import officeVisitsRouter from "./routes/officeVisits.router";
import prescriptionsRouter from "./routes/prescriptions.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * 
 */
app.get('/api', (req, res) => {
    // output APIdoc page
    res.end("Hello");
});

// GET
app.use("/api/patients", patientsRouter);   
app.use("/api/doctors", doctorsRouter);
app.use("/api/doctorhistories", doctorHistoriesRouter);
app.use("/api/drugs", drugsRouter);
app.use("/api/hospitalAffiliations", hospitalAffiliationsRouter);
app.use("/api/hospitals", hospitalsRouter);
app.use("/api/insuranceCompanies", insuranceCompaniesRouter);
app.use("/api/officeVisits", officeVisitsRouter);
app.use("/api/prescriptions", prescriptionsRouter);

export default app;