import express from 'express';
import defaultDataSource from '../datasource';
import { OfficeVisit } from '../entities/OfficeVisit';
import { Doctor } from '../entities/Doctor';
import { Patient } from "../entities/Patient";

const router = express.Router();

interface CreateOfficeVisitParams {
    doctorId: number;
    patientId: number;
    visitDate: Date;
    symptoms: string;
    initialVisit: Boolean;
    initialDiagnosis: string
    followupVisit: Boolean;
    diagnosisStatus: string;
    routineVisit: Boolean;
    bloodPressure: string;
    height: number;
    weight: number;
    diagnosis: string;
    otherVisit: Boolean;
}

interface UpdateOfficeVisitParams {
    doctorId?: number;
    patientId?: number;
    visitDate?: Date;
    symptoms?: string;
    initialVisit?: Boolean;
    initialDiagnosis?: string
    followupVisit?: Boolean;
    diagnosisStatus?: string;
    routineVisit?: Boolean;
    bloodPressure?: string;
    height?: number;
    weight?: number;
    diagnosis?: string;
    otherVisit?: Boolean;
}

// GET - all office visits
router.get("/",async(req, res) => {
    try {
        // query office visits from the database
        const officeVisits = await defaultDataSource
            .getRepository(OfficeVisit)
            .find({relations: ['patient', 'doctor']});

        // return office visits in JSON
        return res.status(200).json({ data: officeVisits });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch office visits" });
    }
});


// POST - create office visit
router.post("/", async (req, res) => {
try {
    const { doctorId,
        patientId,
        visitDate,
        symptoms,
        initialVisit,
        initialDiagnosis,
        followupVisit,
        diagnosisStatus,
        routineVisit,
        bloodPressure,
        height,
        weight,
        diagnosis,
        otherVisit
    } = req.body as CreateOfficeVisitParams;
    
    // TODO: validate & sanitize
    if (!doctorId || !patientId || !visitDate) {
    return res
        .status(400)
        .json({ error: "Office visit has to have at least doctor ID, patient ID and date of visit" });
    }

    if (initialVisit && !followupVisit && !routineVisit && !otherVisit) {      
        if (!initialDiagnosis) {
          return res.status(400).json({ message: "Missing initial diagnosis" });
        }
    } else if (!initialVisit && followupVisit && !routineVisit && !otherVisit) {        
        if (!diagnosisStatus) {
          return res.status(400).json({ message: "Missing diagnosis status" });
        }
    } else if (!initialVisit && !followupVisit && routineVisit && !otherVisit) {        
        if (!bloodPressure || !height || !weight) {
          return res.status(400).json({ message: "Missing blood pressure, height or weight" });
        }
    } else if (!initialVisit && !followupVisit && !routineVisit && otherVisit) {        
        return;
    } else {
        return res.status(400).json({ message: "Visit has to be either initial visit, follow-up visit, routine visit or other visit" });
    }

    // find doctor
    const doctor = await Doctor.findOneBy({id: doctorId});

    if(!doctor){
            return res.status(400).json({ message: "Doctor with given ID not found"});
    }

    // find patient
    const patient = await Patient.findOneBy({id: patientId});

    if(!patient){
        return res.status(400).json({ message: "Patient with given ID not found"});
    }

    // check if visit already exists
    const visit = await OfficeVisit.findOneBy({visitDate: visitDate});
    
    if(visit){
        return res.status(400).json({ message: "Visit already exists"});
    }

    const officeVisit = OfficeVisit.create({
        doctorId: doctor.id,
        patientId: patient.id,
        visitDate: visitDate,
        symptoms: symptoms.trim() ?? "",
        initialVisit: initialVisit,
        initialDiagnosis: initialDiagnosis.trim() ?? "",
        followupVisit: followupVisit,
        diagnosisStatus: diagnosisStatus.trim() ?? "",
        routineVisit: routineVisit,
        bloodPressure: bloodPressure.trim() ?? "",
        height: height ?? 0,
        weight: weight ?? 0,
        diagnosis: diagnosis.trim() ?? "",
        otherVisit: otherVisit
    });
    
    await officeVisit.save();

    // save office visit to database
    const result = await officeVisit.save();

    return res.status(200).json({data: result});
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create office visit" });
    }
});

// GET specific office visit
router.get("/:patientId/:doctorId/:visitDate", async (req, res) => {
    try {
        const { patientId, doctorId, visitDate } = req.params;
    
        const officeVisit = await defaultDataSource
            .getRepository(OfficeVisit)
            .findOne({
                where: { patientId: parseInt(patientId), doctorId: parseInt(doctorId), visitDate: new Date(visitDate) },
                relations: ['patient', 'doctor']
            });

        if(!officeVisit) {
            return res.status(404).json({ error: "Office visit not found" });
        }
    
        return res.status(200).json({ data: officeVisit });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch office visit" });
    }
});

// PUT - update a visit
router.put("/:patientId/:doctorId/:visitDate", async (req, res) => {
    try{
        const { 
            patientId,
            doctorId,
            visitDate,
        } = req.params;
        
        const { 
            symptoms,
            initialVisit,
            initialDiagnosis,
            followupVisit,
            diagnosisStatus,
            routineVisit,
            bloodPressure,
            height,
            weight,
            diagnosis,
            otherVisit
        } = req.body as UpdateOfficeVisitParams;
    
        const officeVisit = await defaultDataSource
            .getRepository(OfficeVisit)
            .findOne({
                where: { patientId: parseInt(patientId), doctorId: parseInt(doctorId), visitDate: new Date(visitDate) },
                relations: ['patient', 'doctor']
            });
    
        if(!officeVisit){
            return res.status(404).json({ error: "Office visit not found" });
        }

        if (!doctorId || !patientId || !visitDate) {
            return res
                .status(400)
                .json({ error: "Office visit has to have at least doctor ID, patient ID and date of visit" });
        }

        if (initialVisit && !followupVisit && !routineVisit && !otherVisit) {      
            if (!initialDiagnosis) {
              return res.status(400).json({ message: "Missing initial diagnosis" });
            }
        } else if (!initialVisit && followupVisit && !routineVisit && !otherVisit) {        
            if (!diagnosisStatus) {
              return res.status(400).json({ message: "Missing diagnosis status" });
            }
        } else if (!initialVisit && !followupVisit && routineVisit && !otherVisit) {        
            if (!bloodPressure || !height || !weight) {
              return res.status(400).json({ message: "Missing blood pressure, height or weight" });
            }
        } else if (!initialVisit && !followupVisit && !routineVisit && otherVisit) {        
            return;
        } else {
            return res.status(400).json({ message: "Visit has to be either initial visit, follow-up visit, routine visit or other visit" });
        }

        // update data (local update)
        officeVisit.symptoms = symptoms ? symptoms.trim() : officeVisit.symptoms;
        officeVisit.initialVisit = initialVisit ? initialVisit : officeVisit.initialVisit;
        officeVisit.initialDiagnosis = initialDiagnosis ? initialDiagnosis.trim() : officeVisit.initialDiagnosis;
        officeVisit.followupVisit = followupVisit ? followupVisit : officeVisit.followupVisit;
        officeVisit.diagnosisStatus = diagnosisStatus ? diagnosisStatus.trim() : officeVisit.diagnosisStatus;
        officeVisit.routineVisit = routineVisit ? routineVisit : officeVisit.routineVisit;
        officeVisit.bloodPressure = bloodPressure ? bloodPressure.trim() : officeVisit.bloodPressure;
        officeVisit.height = height ? height : officeVisit.height;
        officeVisit.weight = weight ? weight : officeVisit.weight;
        officeVisit.diagnosis = diagnosis ? diagnosis.trim() : officeVisit.diagnosis;
        officeVisit.otherVisit = otherVisit ? otherVisit : officeVisit.otherVisit;

        // save changes in database
        const result = await officeVisit.save();

        // return updated data
        return res.status(200).json({ data: result });
        } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not update office visit"});
    }
});

// DELETE 
router.delete("/:patientId/:doctorId/:visitDate", async(req, res) => {
    try{
        const { patientId,
            doctorId,
            visitDate,
        } = req.params;
    
        const officeVisit = await defaultDataSource
            .getRepository(OfficeVisit)
            .findOne({
                where: { 
                    patientId: parseInt(patientId),
                    doctorId: parseInt(doctorId),
                    visitDate: new Date(visitDate)
                },
                relations: ['patient', 'doctor']
            });
    
        if(!officeVisit){
            return res.status(404).json({ error: "Office visit not found" });
        }

        const result = await officeVisit.remove();

        // return deleted data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not delete office visit"});
    }
});

export default router;