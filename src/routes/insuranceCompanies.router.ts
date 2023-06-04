/**
 * @api {get} / Get Insurance Companies
 * @apiName GetInsuranceCompanies
 * @apiGroup Insurance Company
 *
 * @apiDescription Get a list of all insurance companies.
 *
 * @apiSuccess {Object[]} data Array of insurance company objects.
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch the insurance companies.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch insurance companies"
 *     }
 */
/**
 * @api {get} /:id Get Insurance Company
 * @apiName GetInsuranceCompany
 * @apiGroup Insurance Company
 *
 * @apiDescription Get information about an insurance company.
 *
 * @apiParam {Number} id The ID of the insurance company.
 *
 * @apiSuccess {Object} data The insurance company information.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the insurance company was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch the insurance company.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Insurance company not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch insurance company"
 *     }
 */

/**
 * @api {post} / Create Insurance Company
 * @apiName CreateInsuranceCompany
 * @apiGroup Insurance Company
 *
 * @apiDescription Create a new insurance company.
 *
 * @apiParam {String} name The name of the insurance company.
 * @apiParam {String} phone The phone number of the insurance company.
 *
 * @apiSuccess {Object} data The created insurance company.
 *
 * @apiError (400 Bad Request) {String} error Error message indicating missing name or phone number.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to create the insurance company.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Insurance company has to have a name and phone number"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not create insurance company"
 *     }
 */
/**
 * @api {put} /:id Update Insurance Company
 * @apiName UpdateInsuranceCompany
 * @apiGroup Insurance Company
 *
 * @apiDescription Update an existing insurance company.
 *
 * @apiParam {Number} id The ID of the insurance company to update.
 * @apiParam {String} [name] The updated name of the insurance company.
 * @apiParam {String} [phone] The updated phone number of the insurance company.
 *
 * @apiSuccess {Object} data Updated insurance company object.
 *
 * @apiError (400 Bad Request) {String} error Error message indicating the missing name or phone number in the request body.
 * @apiError (404 Not Found) {String} error Error message indicating that the insurance company was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to update the insurance company.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Insurance company not found"
 *     }
 */
/**
 * @api {delete} /:id Delete Insurance Company
 * @apiName DeleteInsuranceCompany
 * @apiGroup Insurance Company
 *
 * @apiDescription Delete an existing insurance company.
 *
 * @apiParam {Number} id The ID of the insurance company to delete.
 *
 * @apiSuccess {Object} data Deleted insurance company object.
 *
 * @apiError (404 Not Found) {String} error Error message indicating that the insurance company was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to delete the insurance company.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Insurance company not found"
 *     }
 */

import express from 'express';
import defaultDataSource from '../datasource';
import { InsuranceCompany } from '../entities/InsuranceCompany';

const router = express.Router();

interface CreateInsuranceCompanyParams {
    name: string;
    phone: string;
}

interface UpdateInsuranceCompanyParams {
    name?: string;
    phone?: string;
}

router.get("/", async(req, res) => {
    try {
        const insuranceCompanies = await defaultDataSource.getRepository(InsuranceCompany).find();
  
        return res.status(200).json({ data: insuranceCompanies });
      } catch (error) {
        console.log("ERROR", { message: error });
  
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch insurance companies" });
      } 
});

// POST - create new insurance company
router.post("/", async (req, res) => {
try {
    const { name, phone } = req.body as CreateInsuranceCompanyParams;

    // TODO: validate & sanitize
    if(!name || !phone) {
    return res
        .status(400)
        .json({ error: "Insurance company has to have a name and phone number"});
    }

    // create new insurance company with given parameters
    const insuranceCompany = InsuranceCompany.create({
        name: name.trim() ?? "",
        phone: phone.trim() ?? "",
    });

    // save insurance company to database
    const result = await insuranceCompany.save();

    return res.status(200).json({data: result});
    } catch (error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create insurance company" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        // get insurance company from database
        const insuranceCompany = await defaultDataSource
            .getRepository(InsuranceCompany)
            .findOne({ where:{id: parseInt(id)}});

        if(!insuranceCompany) {
            return res.status(404).json({ error: "Insurance company not found" });
        }
    
        return res.status(200).json({ data: insuranceCompany });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch insurance company" });
    }
});

// PUT - update
router.put("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const { name, phone } = req.body as UpdateInsuranceCompanyParams;
    
        const insuranceCompany = await defaultDataSource
            .getRepository(InsuranceCompany)
            .findOneBy({ id : parseInt(id) });
    
        if(!insuranceCompany) {
            return res.status(404).json({ error: "Insurance company not found" });
        }

        if(!name || !phone) {
            return res
                .status(400)
                .json({ error: "Insurance company has to have a name and phone number"});
        }

        // local update
        insuranceCompany.name = name ? name.trim() : insuranceCompany.name;
        insuranceCompany.phone = phone ? phone.trim() : insuranceCompany.phone;
    
        // save to database
        const result = await insuranceCompany.save();

        // return updated data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not update insurance company"});
    }
});

// DELETE
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
            
        const insuranceCompany = await defaultDataSource
            .getRepository(InsuranceCompany)
            .findOneBy({ id : parseInt(id) });
    
        if(!insuranceCompany) {
            return res.status(404).json({ error: "Insurance company not found" });
        }

        const result = await insuranceCompany.remove();

        // return deleted data
        return res.status(200).json({ data: result });
        } catch(error) {
            console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not delete insurance company"});
    }
});

export default router;