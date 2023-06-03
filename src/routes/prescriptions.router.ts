import express from 'express';
import defaultDataSource from '../datasource';
import { Prescription } from '../entities/Prescription';
import { Drug } from '../entities/Drug'
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';

const router = express.Router();

interface CreatePrescriptionParams {
    datePrescribed: Date;
    dosage: string;
    duration: Date;
    refillable: Boolean;
    refillNo: number;
    comments: string;
    nonRefillReason: string;
    patientId: number;
    doctorId: number;
    drugId: number;
}

interface UpdatePrescriptionParams {
    datePrescribed?: Date;
    dosage?: string;
    duration?: Date;
    refillable?: Boolean;
    refillNo?: number;
    comments?: string;
    nonRefillReason?: string;
    patientId?: number;
    doctorId?: number;
    drugId?: number;
}

// GET - all prescriptions
router.get("/", async(req, res) => {
    try {
        // retrieve all prescriptions from database
        const prescriptions = await defaultDataSource
            .getRepository(Prescription)
            .find({relations: ['patient', 'doctor', 'drug']});
  
        // return list of prescriptions in JSON format
        return res.status(200).json({ data: prescriptions });
      } catch (error) {
        console.log("ERROR", { message: error });
  
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch prescriptions" });
      } 
});


// POST - create new prescription
router.post("/", async (req, res) => {
try {
    const {
        datePrescribed,
        dosage,
        duration,
        refillable,
        refillNo,
        comments,
        nonRefillReason,
        patientId,
        doctorId,
        drugId
    } = req.body as CreatePrescriptionParams;

    // TODO: validate & sanitize
    if(!datePrescribed || !dosage || !duration || refillable === undefined || patientId || doctorId || drugId) {
    return res
        .status(400)
        .json({ error: "Prescription has to have date prescribed, dosage, duration, refillability, patient ID, doctor ID and drug ID"});
    }

    if(refillable) {
        if(!refillNo) {
            return res
                .status(400)
                .json({ error: "Refillable prescription has to have number of refills"});
        }
    }

    // find patient
    const patient = await Patient.findOneBy({id: patientId});

    if(!patient){
        return res.status(400).json({ message: "Patient with given ID not found"});
    }
    
    // find doctor
    const doctor = await Doctor.findOneBy({id: doctorId});

    if(!doctor){
        return res.status(400).json({ message: "Doctor with given ID not found"});
    }

    // find drug
    const drug = await Drug.findOneBy({id: drugId});

    if(!drug){
        return res.status(400).json({ message: "Drug with given ID not found"});
    }

    // create new prescription with given parameters
    const prescription = Prescription.create({
        datePrescribed: datePrescribed ?? new Date(),
        dosage: dosage.trim() ?? "",
        duration: duration ?? null,
        refillable: refillable,
        refillNo: refillNo ?? 0,
        comments: comments.trim() ?? "",
        nonRefillReason: nonRefillReason.trim() ?? "",
        patientId: patient.id,
        doctorId: doctor.id,
        drugId: drug.id,
    });

    // save prescription to database
    const result = await prescription.save();

    return res.status(200).json({data: result});
    } catch (error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create prescription" });        
    }
});

// get specific prescription
router.get("/:rxId", async (req, res) => {
try {
    const { rxId } = req.params;
    
    // fetch prescription from database
    const prescription = await defaultDataSource
        .getRepository(Prescription)
        .findOne({ where:{rxId: parseInt(rxId)}, relations: ['patient', 'doctor', 'drug'] });

    if(!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
    }
    
    return res.status(200).json({ data: prescription });

} catch (error) {
    console.log("ERROR", { message: error });

    // return system error in case of unexpected error during query
    return res.status(500).json({ message: "Could not fetch prescription" });
}
});

// PUT - update
router.put("/:rxId", async (req, res) => {
    try{
        const { rxId } = req.params;
        const { 
            datePrescribed,
            dosage,
            duration,
            refillable,
            refillNo,
            comments,
            nonRefillReason,
            patientId,
            doctorId,
            drugId
        } = req.body as UpdatePrescriptionParams;
    
        const prescription = await defaultDataSource
            .getRepository(Prescription)
            .findOne({where: {rxId: parseInt(rxId)}, relations: ['patient', 'doctor', 'drug']});
    
        if(!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
        }

        if(!datePrescribed || !dosage || !duration || refillable === undefined || patientId || doctorId || drugId) {
            return res
                .status(400)
                .json({ error: "Prescription has to have date prescribed, dosage, duration, refillability, patent ID, doctor ID and drug ID"});
            }
        
        if(refillable) {
            if(!refillNo) {
                return res
                .status(400)
                .json({ error: "Refillable prescription has to have number of refills"});
            }
        }

        // update prescription
        prescription.datePrescribed = datePrescribed ? datePrescribed : prescription.datePrescribed;
        prescription.dosage = dosage ? dosage.trim() : prescription.dosage;
        prescription.duration = duration ? duration : prescription.duration;
        prescription.refillable = refillable ? refillable : prescription.refillable;
        prescription.refillNo = refillNo ? refillNo : prescription.refillNo;
        prescription.comments = comments ? comments.trim() : prescription.comments;
        prescription.nonRefillReason = nonRefillReason ? nonRefillReason.trim() : prescription.nonRefillReason;

        // find patient
        if(patientId) {
            const patient = await Patient.findOneBy({id: patientId});
            if(!patient) {
                return res.status(400).json({ message: "Patient with given ID not found"});        
            }
            prescription.patientId = patient.id;
        }
    
        // find doctor
        if(doctorId) {
            const doctor = await Doctor.findOneBy({id: doctorId});
            if(!doctor) {
                return res.status(400).json({ message: "Doctor with given ID not found"});        
            }
            prescription.doctorId = doctor.id;
        }

        // find drug
        if(drugId) {
            const drug = await Drug.findOneBy({id: drugId});
            if(!drug) {
                return res.status(400).json({ message: "Drug with given ID not found"});        
            }
            prescription.drugId = drug.id;
        }
    
        // save changes to database
        const result = await prescription.save();

        // return updated data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not update prescription"});
    }
});

// DELETE
router.delete("/:rxId", async(req, res) => {
    try{
        const { rxId } = req.params;
            
        const prescription = await defaultDataSource
            .getRepository(Prescription)
            .findOneBy({ rxId : parseInt(rxId) });
    
        if(!prescription){
            return res.status(404).json({ error: "Prescription not found" });
        }

        const result = await prescription.remove();

        // return deleted prescription
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not delete prescription"});
    }
});

export default router;