/**
 * @api {get} / Get Hospitals
 * @apiName GetHospitals
 * @apiGroup Hospital
 *
 * @apiDescription Retrieve a list of hospitals.
 *
 * @apiSuccess {Object[]} data List of hospitals.
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch hospitals.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch hospitals"
 *     }
 */
/**
 * @api {get} /:id Get Hospital
 * @apiName GetHospital
 * @apiGroup Hospital
 *
 * @apiDescription Get a specific hospital by ID.
 *
 * @apiParam {Number} id The ID of the hospital.
 *
 * @apiSuccess {Object} data The hospital.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the hospital was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch the hospital.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Hospital not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch hospital"
 *     }
 */
/**
 * @api {post} / Create Hospital
 * @apiName CreateHospital
 * @apiGroup Hospital
 *
 * @apiDescription Create a new hospital.
 *
 * @apiParam {String} name The name of the hospital.
 * @apiParam {String} address The address of the hospital.
 * @apiParam {String} phone The phone number of the hospital.
 *
 * @apiError (400 Bad Request) {String} error Error message indicating missing or invalid parameters.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to create a hospital.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Hospital has to have a name, address and phone number"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not create hospital"
 *     }
 */
/**
 * @api {put} /:id Update Hospital
 * @apiName UpdateHospital
 * @apiGroup Hospital
 *
 * @apiDescription Update a specific hospital by ID.
 *
 * @apiParam {Number} id The ID of the hospital.
 * @apiParam {String} [name] The updated name of the hospital.
 * @apiParam {String} [address] The updated address of the hospital.
 * @apiParam {String} [phone] The updated phone number of the hospital.
 *
 * @apiSuccess {Object} data The updated hospital.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the hospital was not found.
 * @apiError (400 Bad Request) {String} error Error message indicating that the hospital must have a name, address, and phone number.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to update the hospital.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Hospital not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Hospital has to have a name, address, and phone number"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not update hospital"
 *     }
 */
/**
 * @api {delete} /:id Delete Hospital
 * @apiName DeleteHospital
 * @apiGroup Hospital
 *
 * @apiDescription Delete a specific hospital by ID.
 *
 * @apiParam {Number} id The ID of the hospital.
 *
 * @apiSuccess {Object} data The deleted hospital.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the hospital was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to delete the hospital.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Hospital not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not delete hospital"
 *     }
 */

import express from 'express';
import defaultDataSource from '../datasource';
import { Hospital } from '../entities/Hospital';

const router = express.Router();

interface CreateHospitalParams {
    name: string;
    address: string;
    phone: string;
}

interface UpdateHospitalParams {
    name?: string;
    address?: string;
    phone?: string;
}

// GET - all hospitals
router.get("/", async(req, res) => {
    try {
        // retrieve hospitals from database
        const hospitals = await defaultDataSource.getRepository(Hospital).find();
  
        // return list of hospitals
        return res.status(200).json({ data: hospitals });
      } catch (error) {
        console.log("ERROR", { message: error });
  
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch hospitals" });
      } 
});


// POST - create new hospital
router.post("/", async (req, res) => {
    try {
        const { name, address, phone } = req.body as CreateHospitalParams;

        // TODO: validate & sanitize
        if(!name || !phone || !address) {
        return res
            .status(400)
            .json({ error: "Hospital has to have a name, address and phone number"});
        }

        // create new hospital with given parameters
        const hospital = Hospital.create({
            name: name.trim() ?? "",
            address: address.trim() ?? "",
            phone: phone.trim() ?? "",
        });

        // save hospital to database
        const result = await hospital.save();

        return res.status(200).json({data: result});
    } catch (error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create hospital" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        // retrieve specific hospital
        const hospital = await defaultDataSource
            .getRepository(Hospital)
            .findOne({ where:{id: parseInt(id)}});

        if(!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }
    
        return res.status(200).json({ data: hospital });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch hospital" });
    }
});

// PUT - update
router.put("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const { name, address, phone } = req.body as UpdateHospitalParams;
    
        const hospital = await defaultDataSource
            .getRepository(Hospital)
            .findOneBy({ id : parseInt(id) });
    
        if(!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }

        if(!name || !phone || !address) {
            return res
                .status(400)
                .json({ error: "Hospital has to have a name, address and phone number"});
        }

        // update record (local update)
        hospital.name = name ? name.trim() : hospital.name;
        hospital.address = address ? address.trim() : hospital.address;
        hospital.phone = phone ? phone.trim() : hospital.phone;
    
        // save changes to database
        const result = await hospital.save();

        // return changed data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not update hospital"});
    }
});

// DELETE
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
            
        const hospital = await defaultDataSource
            .getRepository(Hospital)
            .findOneBy({ id : parseInt(id) });
    
        if(!hospital){
            return res.status(404).json({ error: "Hospital not found" });
        }

        const result = await hospital.remove();

        // return deleted hospital
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not delete hospital"});
    }
});

export default router;