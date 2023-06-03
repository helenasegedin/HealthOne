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