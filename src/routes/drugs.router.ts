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