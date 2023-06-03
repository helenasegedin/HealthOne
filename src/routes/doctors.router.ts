import express from 'express';
import defaultDataSource from '../datasource';
import { Doctor } from '../entities/Doctor';

const router = express.Router();

interface CreateDoctorParams {
    name: string;
    address: string;
    phone: string;
    specialization: string;
    hospitalAffiliation: string;
}

interface UpdateDoctorParams {
    name?: string;
    address?: string;
    phone?: string;
    specialization?: string;
    hospitalAffiliation?: string;
}

// GET - all doctors
router.get("/", async(req, res) => {
    try {
        // get doctors from database
        const doctors = await defaultDataSource.getRepository(Doctor).find();
  
        // return list of doctors
        return res.status(200).json({ data: doctors });
      } catch (error) {
        console.log("ERROR", { message: error });
  
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch doctors" });
      } 
});


// POST - create new doctor
router.post("/", async (req, res) => {
try {
    const { name, address, phone, specialization, hospitalAffiliation } = req.body as CreateDoctorParams;

    // TODO: validate & sanitize
    if(!name || !address || !phone || !specialization || !hospitalAffiliation) {
    return res
        .status(400)
        .json({ error: "Doctor has to have name, address, phone, specialization and hospital affiliation"});
    }

    // create new doctor with given parameters
    const doctor = Doctor.create({
        name: name.trim() ?? "",
        address: address.trim() ?? "",
        phone: phone.trim() ?? "",
        specialization: specialization.trim() ?? "",
        hospitalAffiliation: hospitalAffiliation.trim() ?? "",
    });

    // save doctor to database
    const result = await doctor.save();

    return res.status(200).json({data: result});
    } catch (error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not create doctor" });        
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        const doctor = await defaultDataSource
            .getRepository(Doctor)
            .findOneBy({id: parseInt(id)});

        if(!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
    
        return res.status(200).json({ data: doctor });
    } catch (error) {
        console.log("ERROR", { message: error });

        // return system error in case of unexpected error during query
        return res.status(500).json({ message: "Could not fetch doctor" });
    }
});

// PUT - update
router.put("/:id", async (req, res) => {
try{
    const { id } = req.params;
    const { name, address, phone, specialization, hospitalAffiliation } = req.body as UpdateDoctorParams;
    
    const doctor = await defaultDataSource
        .getRepository(Doctor)
        .findOneBy({ id: parseInt(id) });
    
    if(!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
    }

    if(!name || !address || !phone || !specialization || !hospitalAffiliation) {
        return res
            .status(400)
            .json({ error: "Doctor has to have name, address, phone, specialization and hospital affiliation"});
    }

    // update record (local update)
    doctor.name = name ? name.trim() : doctor.name;
    doctor.address = address ? address.trim() : doctor.address;
    doctor.phone = phone ? phone.trim() : doctor.phone;
    doctor.specialization = specialization ? specialization.trim() : doctor.specialization;
    doctor.hospitalAffiliation = hospitalAffiliation ? hospitalAffiliation.trim() : doctor.hospitalAffiliation;
    
    // save changes to database
    const result = await doctor.save();

    // return updated data
    return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not update doctor"});
    }
});

// DELETE
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
            
        const doctor = await defaultDataSource
            .getRepository(Doctor)
            .findOneBy({ id : parseInt(id) });
    
        if(!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const result = await doctor.remove();

        // return deleted data
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // return system error in case of unexpected error during query
        res.status(500).json({ message: "Could not delete doctor"});
    }
});

export default router;