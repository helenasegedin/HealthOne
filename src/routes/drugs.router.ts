/**
 * @api {get} / Get Drugs
 * @apiName GetDrugs
 * @apiGroup Drug
 *
 * @apiDescription Get a list of all drugs.
 *
 * @apiSuccess {Object[]} data List of drugs.
 *
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch drugs.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch drugs"
 *     }
 */
/**
 * @api {get} /:id Get Drug
 * @apiName GetDrug
 * @apiGroup Drug
 *
 * @apiDescription Get information about a specific drug.
 *
 * @apiParam {Number} id The ID of the drug.
 *
 * @apiSuccess {Object} data Drug information.
 *
 * @apiError (404 Not Found) {String} error Error message indicating the drug was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to fetch the drug.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Drug not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not fetch drug"
 *     }
 */
/**
 * @api {post} / Create Drug
 * @apiName CreateDrug
 * @apiGroup Drug
 *
 * @apiDescription Create a new drug.
 *
 * @apiParam {String} drugName Name of the drug.
 * @apiParam {String} sideEffects Side effects of the drug.
 * @apiParam {String} benefits Benefits of the drug.
 *
 * @apiSuccess {Object} data Created drug data.
 *
 * @apiError (400 Bad Request) {String} error Error message indicating the required parameters are missing or empty.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to create a drug.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Drug has to have name, side effects and benefits"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not create drug"
 *     }
 */
/**
 * @api {put} /:id Update Drug
 * @apiName UpdateDrug
 * @apiGroup Drug
 *
 * @apiDescription Update information about a specific drug.
 *
 * @apiParam {Number} id The ID of the drug.
 *
 * @apiParam {String} [drugName] Updated name of the drug.
 * @apiParam {String} [sideEffects] Updated side effects of the drug.
 * @apiParam {String} [benefits] Updated benefits of the drug.
 *
 * @apiSuccess {Object} data Updated drug information.
 *
 * @apiError (404 Not Found) {String} error Error message indicating the drug was not found.
 * @apiError (400 Bad Request) {String} error Error message indicating missing or invalid parameters.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to update the drug.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Drug not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Drug has to have name, side effects and benefits"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not update drug"
 *     }
 */
/**
 * @api {delete} /:id Delete Drug
 * @apiName DeleteDrug
 * @apiGroup Drug
 *
 * @apiDescription Delete a specific drug.
 *
 * @apiParam {Number} id The ID of the drug to delete.
 *
 * @apiSuccess {Object} data Deleted drug information.
 * @apiSuccess {String} data.drugName Name of the deleted drug.
 * @apiSuccess {String} data.sideEffects Side effects of the deleted drug.
 * @apiSuccess {String} data.benefits Benefits of the deleted drug.
 *
 * @apiError (404 Not Found) {String} error Error message indicating the drug was not found.
 * @apiError (500 Internal Server Error) {String} message Error message indicating the failure to delete the drug.
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *         "error": "Drug not found"
 *     }
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "message": "Could not delete drug"
 *     }
 */

import express from 'express';
import defaultDataSource from '../datasource';
import { Drug } from '../entities/Drug'

const router = express.Router();

interface CreateDrugParams {
    drugName: string;
    sideEffects: string;
    benefits: string;
}

interface UpdateDrugParams {
    drugName?: string;
    sideEffects?: string;
    benefits?: string;
}

// GET - all drugs
router.get("/", async(req, res) => {
    try {
        // find all drugs
        const drugs = await defaultDataSource.getRepository(Drug).find();
  
        // return list of drugs
        return res.status(200).json({ data: drugs });
      } catch (error) {
        console.log("ERROR", { message: error });
  
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch drugs" });
      } 
});

// POST - create new drug
router.post("/", async (req, res) => {
try {
    const { drugName, sideEffects, benefits } = req.body as CreateDrugParams;

    // TODO: validate & sanitize
    if(!drugName.trim() || !sideEffects.trim() || !benefits.trim()) {
    return res
        .status(400)
        .json({ error: "Drug has to have name, side effects and benefits"});
    }

    // create new drug with given parameters
    const drug = Drug.create({
        drugName: drugName.trim() ?? "",
        sideEffects: sideEffects.trim() ?? "",
        benefits: benefits.trim() ?? "",
    });

    // save drug to database
    const result = await drug.save();

    return res.status(200).json({data: result});
    } catch (error) {
        console.log("ERROR", { message: error });
        
    // return system error in case of unexpected error during query
    return res.status(500).json({ message: "Could not fetch drug" });        
    }
});

// get specific drug
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        // find drug
        const drug = await defaultDataSource
            .getRepository(Drug)
            .findOneBy({ id: parseInt(id)});

        if(!drug) {
            return res.status(404).json({ error: "Drug not found" });
        }
    
        return res.status(200).json({ data: drug });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch drug" });
    }
});

// PUT - update
router.put("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const { drugName, sideEffects, benefits } = req.body as UpdateDrugParams;
    
        const drug = await defaultDataSource
        .getRepository(Drug)
        .findOneBy({ id : parseInt(id) });
    
        if(!drug) {
        return res.status(404).json({ error: "Drug not found" });
        }

        if(!drugName?.trim() || !sideEffects?.trim() || !benefits?.trim()) {
            return res
                .status(400)
                .json({ error: "Drug has to have name, side effects and benefits"});
        }        

        // update drug properties
        drug.drugName = drugName ? drugName.trim() : drug.drugName;
        drug.sideEffects = sideEffects ? sideEffects.trim() : drug.sideEffects;
        drug.benefits = benefits ? benefits.trim() : drug.benefits;
    
        // save changes to database
        const result = await drug.save();

        // return saved data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not update drug"});
    }
});

// DELETE
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
            
        const drug = await defaultDataSource
            .getRepository(Drug)
            .findOneBy({ id : parseInt(id) });
    
        if(!drug){
            return res.status(404).json({ error: "Drug not found" });
        }

        const result = await drug.remove();

        // return deleted drug
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not delete drug"});
    }
});

export default router;