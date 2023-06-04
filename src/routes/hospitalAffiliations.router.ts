/**
 * @api {get} / Get Hospital Affiliations
 * @apiName GetHospitalAffiliations
 * @apiGroup HospitalAffiliation
 *
 * @apiDescription Retrieve a list of hospital affiliations.
 *
 * @apiSuccess {Object[]} data List of hospital affiliations.
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch hospital affiliations.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch hospital affiliations"
 *     }
 */
/**
 * @api {get} /:doctorId/:hospitalId Get Hospital Affiliation
 * @apiName GetHospitalAffiliation
 * @apiGroup HospitalAffiliation
 *
 * @apiDescription Get the hospital affiliation for the specified doctor and hospital.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} hospitalId The ID of the hospital.
 *
 * @apiSuccess {Object} data The hospital affiliation.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the hospital affiliation was not found.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Hospital affiliation not found"
 *     }
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch hospital affiliation.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch hospital affiliation"
 *     }
 */

/**
 * @api {post} / Create Hospital Affiliation
 * @apiName CreateHospitalAffiliation
 * @apiGroup HospitalAffiliation
 *
 * @apiDescription Create a new hospital affiliation.
 *
 * @apiParam {Number} doctorId The ID of the doctor to associate with the hospital.
 * @apiParam {Number} hospitalId The ID of the hospital to associate with the doctor.
 * @apiParam {Date} [affiliationDate] The affiliation date (optional, defaults to the current date if not provided).
 *
 * @apiSuccess {Object} data The created hospital affiliation.
 *
 * @apiError (400 Bad Request) {String} error Error message indicating missing or invalid parameters.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Hospital affiliation has to have doctor ID, hospital ID and affiliation date"
 *     }
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to create hospital affiliation.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not create hospital affiliation"
 *     }
 */
/**
 * @api {put} /:doctorId/:hospitalId Update Hospital Affiliation
 * @apiName UpdateHospitalAffiliation
 * @apiGroup HospitalAffiliation
 *
 * @apiDescription Update the affiliation date of the hospital affiliation for the specified doctor and hospital.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} hospitalId The ID of the hospital.
 *
 * @apiParam {Date} [affiliationDate] The updated affiliation date.
 *
 * @apiSuccess {Object} data The updated hospital affiliation.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the hospital affiliation was not found.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Hospital affiliation not found"
 *     }
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to update hospital affiliation.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not update hospital affiliation"
 *     }
 */
/**
 * @api {delete} /:doctorId/:hospitalId Delete Hospital Affiliation
 * @apiName DeleteHospitalAffiliation
 * @apiGroup HospitalAffiliation
 *
 * @apiDescription Delete the hospital affiliation for the specified doctor and hospital.
 *
 * @apiParam {Number} doctorId The ID of the doctor.
 * @apiParam {Number} hospitalId The ID of the hospital.
 *
 * @apiSuccess {Object} data The deleted hospital affiliation.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the hospital affiliation was not found.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Hospital affiliation not found"
 *     }
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to delete hospital affiliation.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not delete hospital affiliation"
 *     }
 */

import express from 'express';
import defaultDataSource from '../datasource';
import { HospitalAffiliation } from '../entities/HospitalAffiliation';
import { Doctor } from '../entities/Doctor';
import { Hospital } from '../entities/Hospital';

const router = express.Router();

interface CreateHospitalAffiliationParams {
    doctorId: number;
    hospitalId: number;
    affiliationDate: Date;
}

interface UpdateHospitalAffiliationParams {
    doctorId?: number;
    hospitalId?: number;
    affiliationDate?: Date;
}

// GET - all affiliations
router.get("/",async(req, res) => {
try {
    // query affiliations from the database
    const hospitalAffiliations = await defaultDataSource
        .getRepository(HospitalAffiliation)
        .find({relations: ['hospital', 'doctor']});

    // return affiliations in JSON
    return res.status(200).json({ data: hospitalAffiliations });
} catch (error) {
    console.log("ERROR", { message: error });

    // return system error in case of unexpected error during query
    return res.status(500).json({ message: "Could not fetch hospital affiliations" });
}
});


// POST - create affiliation
router.post("/", async (req, res) => {
    try {
        const { doctorId, hospitalId, affiliationDate } = req.body as CreateHospitalAffiliationParams;
    
        // TODO: validate & sanitize
        if (!doctorId || !hospitalId || !affiliationDate) {
            return res
                .status(400)
                .json({ error: "Hospital affiliation has to have doctor ID, hospital ID and affiliation date" });
        }

        // find doctor
        const doctor = await Doctor.findOneBy({id: doctorId});
        if(!doctor){
            return res.status(400).json({ message: "Doctor with given ID not found"});
        }

        // find hospital
        const hospital = await Hospital.findOneBy({id: hospitalId});
        if(!hospital){
            return res.status(400).json({ message: "Hospital with given ID not found"});
        }

        const hospitalAffiliation = HospitalAffiliation.create({
            doctorId: doctor.id,
            hospitalId: hospital.id,
            affiliationDate: affiliationDate ?? new Date(),
        });

        await hospitalAffiliation.save();

        // save hospital affiliation to database
        const result = await hospitalAffiliation.save();

        return res.status(200).json({data: result});
    
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create hospital affiliation" });
    }
});

// GET - specific hospital affiliation
router.get("/:doctorId/:hospitalId", async (req, res) => {
    try {
        const { doctorId, hospitalId } = req.params;
    
        const hospitalAffiliation = await defaultDataSource
            .getRepository(HospitalAffiliation)
            .findOne({
                where: { hospitalId: parseInt(hospitalId), doctorId: parseInt(doctorId) },
                relations: ['hospital', 'doctor']
            });

        if(!hospitalAffiliation){
            return res.status(404).json({ error: "Hospital affiliation not found" });
        }
    
        return res.status(200).json({ data: hospitalAffiliation });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch hospital affiliation" });
    }
});

// PUT - update
router.put("/:doctorId/:hospitalId", async (req, res) => {
    try{
        const { doctorId, hospitalId } = req.params;
        const { affiliationDate } = req.body as UpdateHospitalAffiliationParams;
    
        const hospitalAffiliation = await defaultDataSource
            .getRepository(HospitalAffiliation)
            .findOne({
                where: { hospitalId: parseInt(hospitalId), doctorId: parseInt(doctorId) },
                relations: ['hospital', 'doctor']
            });
    
        if(!hospitalAffiliation){
            return res.status(404).json({ error: "Hospital affiliation not found" });
        }

        // update data
        hospitalAffiliation.affiliationDate = affiliationDate ? affiliationDate : hospitalAffiliation.affiliationDate;

        // save to database
        const result = await hospitalAffiliation.save();

        // return updated data
        return res.status(200).json({ data: result });
        } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not update hospital affiliation"});
    }
});

// DELETE
router.delete("/:doctorId/:hospitalId", async(req, res) => {
    try{
        const { doctorId, hospitalId } = req.params;
    
        const hospitalAffiliation = await defaultDataSource
            .getRepository(HospitalAffiliation)
            .findOne({
                where: { hospitalId: parseInt(hospitalId), doctorId: parseInt(doctorId) },
                relations: ['hospital', 'doctor']
            });
    
        if(!hospitalAffiliation){
            return res.status(404).json({ error: "Hospital affiliation not found" });
        }

        const result = await hospitalAffiliation.remove();

        // return deleted data
        return res.status(200).json({ data: result });
        
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not delete hospital affiliation"});
    }
});

export default router;