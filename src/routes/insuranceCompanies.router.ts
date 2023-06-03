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