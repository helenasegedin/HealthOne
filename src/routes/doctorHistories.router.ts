/**
 * @api {get} / Get All Doctor Histories
 * @apiName GetAllDoctorHistories
 * @apiGroup DoctorHistory
 *
 * @apiDescription Get a list of all doctor histories.
 *
 * @apiSuccess (200) {Object[]} data List of doctor histories.
 */

/**
 * @api {get} /:doctorId/:patientId Get Specific Doctor History
 * @apiName GetDoctorHistory
 * @apiGroup DoctorHistory
 *
 * @apiDescription Get a specific doctor history entry.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} patientId The ID of the patient.
 *
 * @apiSuccess (200) {Object} data The retrieved doctor history.
 * 
 * @apiError (404 Not Found) NotFound Doctor history not found.
 */

/**
 * @api {post} / Create Doctor History
 * @apiName CreateDoctorHistory
 * @apiGroup DoctorHistory
 *
 * @apiDescription Create a new doctor history entry.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} patientId The ID of the patient.
 * @apiParam {Date} startDate The start date of the doctor history.
 * @apiParam {Date} [endDate] The end date of the doctor history (optional).
 * @apiParam {String} [reasonForLeaving] The reason for leaving (optional).
 *
 * @apiSuccess (200) {Object} data The created doctor history entry.
 * 
 * @apiError (400 Bad Request) BadRequest Doctor history has missing or invalid parameters.
 * @apiError (500 Internal Server Error) InternalServerError Failed to create doctor history.
 */

/**
 * @api {put} /:doctorId/:patientId Update Doctor History
 * @apiName UpdateDoctorHistory
 * @apiGroup DoctorHistory
 *
 * @apiDescription Update an existing doctor history entry.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} patientId The ID of the patient.
 * @apiParam {Date} [startDate] The updated start date of the doctor history (optional).
 * @apiParam {Date} [endDate] The updated end date of the doctor history (optional).
 * @apiParam {String} [reasonForLeaving] The updated reason for leaving (optional).
 *
 * @apiSuccess (200) {Object} data The updated doctor history entry.
 * 
 * @apiError (404 Not Found) NotFound Doctor history not found.
 * @apiError (400 Bad Request) BadRequest Doctor history has missing or invalid parameters.
 * @apiError (500 Internal Server Error) InternalServerError Failed to update doctor history.
 */

/**
 * @api {delete} /:doctorId/:patientId Delete Doctor History
 * @apiName DeleteDoctorHistory
 * @apiGroup DoctorHistory
 * @apiDescription Delete an existing doctor history entry.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} patientId The ID of the patient.
 *
 * @apiSuccess (200) {Object} data The deleted doctor history entry.
 * 
 * @apiError (404 Not Found) NotFound Doctor history not found.
 * @apiError (500 Internal Server Error) InternalServerError Failed to delete doctor history.
 */

import express from 'express';
import defaultDataSource from '../datasource';
import { Patient } from "../entities/Patient";
import { Doctor } from '../entities/Doctor';
import { DoctorHistory } from '../entities/DoctorHistory';

const router = express.Router();

interface CreateDoctorHistoryParams {
    doctorId: number;
    patientId: number;
    startDate: Date;
    endDate: Date;
    reasonForLeaving: string;
}

interface UpdateDoctorHistoryParams {
    doctorId?: number;
    patientId?: number;
    startDate?: Date;
    endDate?: Date;
    reasonForLeaving?: string;
}

// GET - all doctor histories
router.get("/", async(req, res) => {
try {
    // query doctor histories from the database
    const doctorHistories = await defaultDataSource
        .getRepository(DoctorHistory)
        .find({relations: ['patient', 'doctor']});

    // return doctor histories in JSON
    return res.status(200).json({ data: doctorHistories });
} catch (error) {
    console.log("ERROR", { message: error });

    // return system error in case of unexpected error during query
    return res.status(500).json({ message: "Could not fetch histories" });
}
});


// POST - create new doctor history
router.post("/", async (req, res) => {
try {
    const { doctorId, patientId, startDate, endDate, reasonForLeaving } = req.body as CreateDoctorHistoryParams;
    
        // TODO: validate & sanitize
        if (!doctorId || !patientId || !startDate) {
        return res
            .status(400)
            .json({ error: "Doctor history has to have doctor ID, patient ID and start date" });
            }

        if (startDate.getTime() > endDate.getTime()) {
            return res
            .status(400)
            .json({ error: "End date can not be before start date" });
        }

        const doctor = await Doctor.findOneBy({id: doctorId});

        if(!doctor){
            return res.status(400).json({ message: "Doctor with given ID not found"});
        }

        const patient = await Patient.findOneBy({id: patientId});

        if(!patient){
            return res.status(400).json({ message: "Patient with given ID not found"});
        }

        const doctorHistory = DoctorHistory.create({
            doctorId: doctor.id,
            patientId: patient.id,
            startDate: startDate ?? new Date(),
            endDate: endDate ?? null,
            reasonForLeaving: reasonForLeaving ?? ""
        });
        await doctorHistory.save();

        // save doctor history to database
        const result = await doctorHistory.save();

        return res.status(200).json({data: result});
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create doctor history" });
    }
});

// GET - specific doctor history
router.get("/:doctorId/:patientId", async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;
    
        const doctorHistory = await defaultDataSource
            .getRepository(DoctorHistory)
            .findOne({
                where: { patientId: parseInt(patientId), doctorId: parseInt(doctorId) },
                relations: ['patient', 'doctor']
            });

        if(!doctorHistory){
            return res.status(404).json({ error: "Doctor history not found" });
        }
    
        return res.status(200).json({ data: doctorHistory });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch doctor history" });
    }
});

// PUT - update
router.put("/:doctorId/:patientId", async (req, res) => {
    try{
        const { doctorId, patientId } = req.params;
        const { startDate, endDate, reasonForLeaving } = req.body as UpdateDoctorHistoryParams;
    
        const doctorHistory = await defaultDataSource
            .getRepository(DoctorHistory)
            .findOne({
                where: { patientId: parseInt(patientId), doctorId: parseInt(doctorId) },
                relations: ['patient', 'doctor']
            });
    
        if(!doctorHistory){
            return res.status(404).json({ error: "Doctor history not found" });
        }

        if (!startDate) {
            return res
                .status(400)
                .json({ error: "Doctor history has to have a start date" });
                }

        if (startDate && endDate && startDate.getTime > endDate.getTime) {
            return res
            .status(400)
            .json({ error: "End date can not be before start date" });
        }

        // update data (local update)
        doctorHistory.startDate = startDate ? startDate : doctorHistory.startDate;
        doctorHistory.endDate = endDate ? endDate : doctorHistory.endDate;
        doctorHistory.reasonForLeaving = reasonForLeaving ? reasonForLeaving.trim() : doctorHistory.reasonForLeaving;

        // save changes to database
        const result = await doctorHistory.save();

        // return updated data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not update doctor history"});
    }
});

// DELETE
router.delete("/:doctorId/:patientId", async(req, res) => {
    try{
        const { doctorId, patientId } = req.params;
    
        const doctorHistory = await defaultDataSource
            .getRepository(DoctorHistory)
            .findOne({
                where: { patientId: parseInt(patientId), doctorId: parseInt(doctorId) },
                relations: ['patient', 'doctor']
            });
    
        if(!doctorHistory){
            return res.status(404).json({ error: "Doctor history not found" });
        }

        const result = await doctorHistory.remove();

        // return deleted data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not delete doctor history"});
    }
});

export default router;