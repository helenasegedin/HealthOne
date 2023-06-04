/**
 * @api {get} / Get All Office Visits
 * @apiName GetAllOfficeVisits
 * @apiGroup Office Visit
 *
 * @apiDescription Get a list of all office visits.
 *
 * @apiSuccess {Object[]} data List of office visits.
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch office visits.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch office visits"
 *     }
 */
/**
 * @api {get} /:patientId/:doctorId/:visitDate Get Office Visit
 * @apiName GetOfficeVisit
 * @apiGroup Office Visit
 *
 * @apiParam {Number} patientId ID of the patient.
 * @apiParam {Number} doctorId ID of the doctor.
 * @apiParam {Date} visitDate Date of the visit (format: YYYY-MM-DD).
 *
 * @apiSuccess {Object} data Office visit data.
 *
 * @apiError NotFound The requested office visit does not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Office visit not found"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while fetching the office visit.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not fetch office visit"
 *     }
 */
/**
 * @api {post} / Create Office Visit
 * @apiName CreateOfficeVisit
 * @apiGroup Office Visit
 *
 * @apiDescription Create a new office visit.
 *
 * @apiParam {Number} doctorId ID of the doctor associated with the office visit.
 * @apiParam {Number} patientId ID of the patient associated with the office visit.
 * @apiParam {Date} visitDate Date of the office visit (format: "YYYY-MM-DD").
 * @apiParam {String} [symptoms] Symptoms reported during the office visit.
 * @apiParam {Boolean} initialVisit Indicates if it is an initial visit.
 * @apiParam {String} [initialDiagnosis] Initial diagnosis given during initial visit.
 * @apiParam {Boolean} followupVisit Indicates if it is a follow-up visit.
 * @apiParam {String} [diagnosisStatus] Diagnosis status for follow-up visits.
 * @apiParam {Boolean} routineVisit Indicates if it is a routine visit.
 * @apiParam {String} [bloodPressure] Blood pressure measurement during routine visit.
 * @apiParam {Number} [height] Height measurement during routine visit.
 * @apiParam {Number} [weight] Weight measurement during routine visit.
 * @apiParam {String} [diagnosis] Diagnosis given during routine visit.
 * @apiParam {Boolean} otherVisit Indicates if it is another type of visit.
 *
 * @apiSuccess {Object} data The created office visit.
 *
 * @apiError (400 Bad Request) {String} message Error message indicating the reason for the bad request.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "message": "Office visit has to have at least doctor ID, patient ID and date of visit"
 *     }
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to create an office visit.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not create office visit"
 *     }
 */
/**
 * @api {put} /:patientId/:doctorId/:visitDate Update Office Visit
 * @apiName UpdateOfficeVisit
 * @apiGroup Office Visit
 *
 * @apiParam {Number} patientId ID of the patient.
 * @apiParam {Number} doctorId ID of the doctor.
 * @apiParam {Date} visitDate Date of the visit (format: YYYY-MM-DD).
 *
 * @apiParam {String} [symptoms] Symptoms reported during the visit.
 * @apiParam {Boolean} [initialVisit] Indicates if it is an initial visit.
 * @apiParam {String} [initialDiagnosis] Initial diagnosis made during the visit.
 * @apiParam {Boolean} [followupVisit] Indicates if it is a follow-up visit.
 * @apiParam {String} [diagnosisStatus] Diagnosis status during the follow-up visit.
 * @apiParam {Boolean} [routineVisit] Indicates if it is a routine visit.
 * @apiParam {String} [bloodPressure] Blood pressure measurement during the routine visit.
 * @apiParam {Number} [height] Height measurement during the routine visit.
 * @apiParam {Number} [weight] Weight measurement during the routine visit.
 * @apiParam {String} [diagnosis] Diagnosis made during the visit.
 * @apiParam {Boolean} [otherVisit] Indicates if it is another type of visit.
 *
 * @apiSuccess {Object} data Updated office visit data.
 *
 * @apiError NotFound The requested office visit does not exist.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Office visit not found"
 *     }
 *
 * @apiError BadRequest Invalid or missing parameters for updating the office visit.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing initial diagnosis"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while updating the office visit.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not update office visit"
 *     }
 */
/**
 * @api {delete} /:patientId/:doctorId/:visitDate Delete Office Visit
 * @apiName DeleteOfficeVisit
 * @apiGroup Office Visit
 *
 * @apiParam {Number} patientId ID of the patient.
 * @apiParam {Number} doctorId ID of the doctor.
 * @apiParam {Date} visitDate Date of the visit.
 *
 * @apiSuccess {Object} data Deleted office visit data.
 *
 * @apiError NotFound The requested office visit does not exist.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Office visit not found"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while deleting the office visit.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not delete office visit"
 *     }
 */

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