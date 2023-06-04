/**
 * @api {get} / Get All Patients
 * @apiName GetAllPatients
 * @apiGroup Patient
 *
 * @apiSuccess {Object[]} data List of patients.
 *
 * @apiError ServerError An unexpected error occurred while fetching the patients.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not fetch patients"
 *     }
 */
/**
 * @api {get} /:id Get Patient by ID
 * @apiName GetPatientByID
 * @apiGroup Patient
 *
 * @apiParam {Number} id Patient's unique ID.
 *
 * @apiSuccess {Object} data The patient object with the specified ID.
 *
 * @apiError PatientNotFound The patient with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Patient not found"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while fetching the patient.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not fetch patient"
 *     }
 */

/**
 * @api {post} / Create a Patient
 * @apiName CreatePatient
 * @apiGroup Patient
 *
 * @apiParam {String} name Patient's name.
 * @apiParam {String} address Patient's address.
 * @apiParam {String} phone Patient's phone number.
 * @apiParam {String} email Patient's email address.
 * @apiParam {Number} insuranceOwnerId ID of the insurance owner (if relationship is "dependent").
 * @apiParam {String} relationship Patient's status as either "insuranceOwner" or "dependent".
 * @apiParam {Number} doctorId ID of the doctor associated with the patient.
 * @apiParam {Number} insuranceId ID of the insurance company associated with the patient.
 *
 * @apiSuccess {Object} data The created patient object.
 *
 * @apiError ValidationError The request body is missing required parameters or contains invalid data.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Patient has to have name, address, phone, email, relationship, doctor ID and insurance ID"
 *     }
 *
 * @apiError InvalidRelationship The provided relationship type is invalid.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid relationship type"
 *     }
 *
 * @apiError MissingInsuranceOwner The insurance owner ID is required for dependent patients.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Insurance owner ID is required for dependent patients"
 *     }
 *
 * @apiError InsuranceOwnerNotFound The insurance owner with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Insurance owner with given ID not found"
 *     }
 *
 * @apiError DoctorNotFound The doctor with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Doctor with given ID not found"
 *     }
 *
 * @apiError InsuranceCompanyNotFound The insurance company with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Insurance company with given ID not found"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while creating the patient.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not create patient"
 *     }
 */
/**
 * @api {put} /:id Update Patient
 * @apiName UpdatePatient
 * @apiGroup Patient
 *
 * @apiParam {Number} id Patient's unique ID.
 *
 * @apiParam {String} [name] Patient's name.
 * @apiParam {String} [address] Patient's address.
 * @apiParam {String} [phone] Patient's phone number.
 * @apiParam {String} [email] Patient's email address.
 * @apiParam {Number} [insuranceOwnerId] ID of the insurance owner for dependent patients.
 * @apiParam {String} [relationship] Patient's status as 'insuranceOwner' or 'dependent'.
 * @apiParam {Number} [doctorId] ID of the patient's doctor.
 * @apiParam {Number} [insuranceId] ID of the patient's insurance company.
 *
 * @apiSuccess {Object} data The updated patient object.
 *
 * @apiError PatientNotFound The patient with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Patient not found"
 *     }
 *
 * @apiError InvalidInput Some required fields are missing or invalid.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Patient has to have name, address, phone, email, relationship, doctor ID and insurance ID"
 *     }
 *
 * @apiError InvalidRelationship The provided relationship type is invalid.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid relationship type"
 *     }
 *
 * @apiError MissingInsuranceOwnerID Insurance owner ID is required for dependent patients.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Insurance owner ID is required for dependent patients"
 *     }
 *
 * @apiError InsuranceOwnerNotFound The insurance owner with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Insurance owner with given ID not found"
 *     }
 *
 * @apiError DoctorNotFound The doctor with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Doctor with given ID not found"
 *     }
 *
 * @apiError InsuranceCompanyNotFound The insurance company with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Insurance company with given ID not found"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while updating the patient.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not update patient"
 *     }
 */
/**
 * @api {delete} /:id Delete Patient
 * @apiName DeletePatient
 * @apiGroup Patient
 *
 * @apiParam {Number} id Patient's unique ID.
 *
 * @apiSuccess {Object} data The deleted patient object.
 *
 * @apiError PatientNotFound The patient with the given ID was not found.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Patient not found"
 *     }
 *
 * @apiError ServerError An unexpected error occurred while deleting the patient.
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Could not delete patient"
 *     }
 */

import express from 'express';
import defaultDataSource from '../datasource';
import { Patient } from "../entities/Patient";
import { Doctor } from '../entities/Doctor';
import { InsuranceCompany } from '../entities/InsuranceCompany';

const router = express.Router();

interface CreatePatientParams {
    name: string;
    address: string;
    phone: string;
    email: string;
    insuranceOwnerId: number;
    relationship: string;
    doctorId: number;
    insuranceId: number;
}

interface UpdatePatientParams {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    insuranceOwnerId?: number;
    relationship?: string;
    doctorId?: number;
    insuranceId?: number;
}

// GET all patients
router.get("/",async(req, res) => {
    try {
        const patients = await defaultDataSource
            .getRepository(Patient)
            .find({relations: ['insuranceCompany', 'doctor', 'insuranceOwner']});

        return res.status(200).json({ data: patients });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch patients" });
    }
});


// POST - create new patient
router.post("/", async (req, res) => {
    try {
        const { name, address, phone, email, insuranceOwnerId, relationship, doctorId, insuranceId } = req.body as CreatePatientParams;
    
        // TODO: validate & sanitize
        if (!name || !address || !phone || !email || !relationship || !doctorId || !insuranceId) {
            return res
                .status(400)
                .json({ error: "Patient has to have name, address, phone, email, relationship, doctor ID and insurance ID" });
        }

        // check if the relationship type is valid
        if (relationship !== 'insuranceOwner' && relationship !== 'dependent') {
            return res.status(400).json({ error: 'Invalid relationship type' });
        }

        // check for insurance owner ID
        if(relationship == 'dependent' && !insuranceOwnerId) {
            return res
                .status(400)
                .json({ error: "Insurance owner ID is required for dependent patients" });
        }

        // find insurance owner
        const insuranceOwner = await Patient.findOneBy({id: insuranceOwnerId});

        if(!insuranceOwner) {
            return res.status(400).json({ message: "Insurance owner with given ID not found"}); 
        }

        // find doctor
        const doctor = await Doctor.findOneBy({id: doctorId});

        if(!doctor){
            return res.status(400).json({ message: "Doctor with given ID not found"});
        }

        // find insurance company
        const insurance = await InsuranceCompany.findOneBy({id: insuranceId});

        if(!insurance){
            return res.status(400).json({ message: "Insurance company with given ID not found"});
        }

        // create new patient with given parameters
        const patient = Patient.create({
            name: name.trim() ?? "",
            address: address.trim() ?? "",
            phone: phone.trim() ?? "",
            email: email.trim() ?? "",
            insuranceOwnerId: insuranceOwner.id,
            relationship: relationship.trim() ?? "",
            doctorId: doctor.id,            
            insuranceId: insurance.id,
        });
        await patient.save();

        // save patient to database
        const result = await patient.save();

        return res.status(200).json({data: result});
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch patients" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        const patient = await defaultDataSource
            .getRepository(Patient)
            .findOne({where: {id : parseInt(id)}, relations: ['insuranceCompany', 'doctor', 'insuranceOwner']});
    
        if(!patient){
            return res.status(404).json({ error: "Patient not found" });
        }

        return res.status(200).json({ data: patient });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch patient" });
    }
});

// PUT - update
router.put("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const { name, address, phone, email, insuranceOwnerId, relationship, doctorId, insuranceId } = req.body as UpdatePatientParams;
    
        const patient = await defaultDataSource
            .getRepository(Patient)
            .findOne({where: {id: parseInt(id)}, relations: ['insuranceCompany', 'doctor', 'insuranceOwner']});
    
        if(!patient){
            return res.status(404).json({ error: "Patient not found" });
        }

        // TODO: validate & sanitize
        if (!name || !address || !phone || !email || !relationship || !doctorId || !insuranceId) {
            return res
                .status(400)
                .json({ error: "Patient has to have name, address, phone, email, relationship, doctor ID and insurance ID" });
        }

        // check if the relationship type is valid
        if (relationship !== 'insuranceOwner' && relationship !== 'dependent') {
            return res.status(400).json({ error: 'Invalid relationship type' });
        }

        // check for insurance owner ID
        if(relationship == 'dependent' && !insuranceOwnerId) {
            return res
                .status(400)
                .json({ error: "Insurance owner ID is required for dependent patients" });
        }

        // update patient record (local update)
        patient.name = name ? name.trim() : patient.name;
        patient.address = address ? address.trim() : patient.address;
        patient.phone = phone ? phone.trim() : patient.phone;
        patient.email = email ? email.trim() : patient.email;
        patient.relationship = relationship ? relationship.trim() : patient.relationship;

        // find insurance owner
        if(insuranceOwnerId) {
            const insuranceOwner = await Patient.findOneBy({id: insuranceOwnerId});
            if(!insuranceOwner){
                return res.status(400).json({ message: "Insurance owner with given ID not found"});
            }
            patient.insuranceOwnerId = insuranceOwner.id;
        }

        // find doctor
        if(doctorId) {
            const doctor = await Doctor.findOneBy({id: doctorId});
            if(!doctor){
                return res.status(400).json({ message: "Doctor with given ID not found"});
            }
            patient.doctorId = doctor.id;
        }

        // find insurance company
        if(insuranceId) {
            const insuranceCompany = await InsuranceCompany.findOneBy({id: insuranceId});
            if(!insuranceCompany){
                return res.status(400).json({ message: "Insurance company with given ID not found"});
            }
            patient.insuranceId = insuranceCompany.id;
        }     

        // save to database
        const result = await patient.save();

        // return updated record
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not update patient"});
    }
});

// DELETE
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
    
        const patient = await defaultDataSource
            .getRepository(Patient)
            .findOne({where: {id: parseInt(id)}, relations: ['insuranceCompany', 'doctor', 'insuranceOwner']});
    
        if(!patient){
            return res.status(404).json({ error: "Patient not found" });
        }

        const result = await patient.remove();

        // return deleted patient
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not delete patient"});
    }
});

export default router;