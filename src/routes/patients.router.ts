import express from 'express';
import { Patient } from "../entities/Patient";
import { Doctor } from '../entities/Doctor';
import defaultDataSource from '../datasource';

const router = express.Router();

interface CreatePatientParams {
    title: string;
    body: string;
    doctorId: number;
}

interface UpdatePatientParams {
    title?: string;
    body?: string;
    doctorId?: number;
}

// GET - info päring (kõik artiklid)
router.get("/",async(req, res) => {
try {
    // küsi artiklid andmebaasist
    const patients = await defaultDataSource.getRepository(Patient).find();

    // vasta artiklite kogunikuga JSON formaadis
    return res.status(200).json({ data: patients });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
    return res.status(500).json({ message: "Could not fetch patients" });
}
});


// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { title, body, doctorId } = req.body as CreatePatientParams;
    
    // TODO: validate & sanitize
    if (!title || !body) {
    return res
        .status(400)
        .json({ error: "Patient has to have title and body" });
        }

        // NOTE: võib tekkida probleeme, kui ID väljale kaasa anda "undefined" väärtus
        // otsime üles autori, kellele artikkel kuulub
        const doctor = await Doctor.findOneBy({id: doctorId});

        if(!doctor){
            return res.status(400).json({ message: "Doctor with given ID not found"});
        }

        // create new patient with given parameters
        const patient = Patient.create({
            title: title.trim() ?? "",
            body: body.trim() ?? "",
            doctorId: doctor.id,
            // doctor: doctor,
        });

        // save patient to database
        const result = await patient.save();

        return res.status(200).json({data: result});
    }catch(error){
        console.log("ERROR", { message: error });
        
        // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
        return res.status(500).json({ message: "Could not fetch patients" });
    }
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        const patient = await defaultDataSource
            .getRepository(Patient)
            .findOneBy({ id : parseInt(id) });
    
        return res.status(200).json({ data: patient });
    } catch (error) {
        console.log("ERROR", { message: error });

        // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
        return res.status(500).json({ message: "Could not fetch patients" });
    }
});

// PUT - update
router.put("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const { title, body, doctorId } = req.body as UpdatePatientParams;
    
        const patient = await defaultDataSource
            .getRepository(Patient)
            .findOneBy({ id : parseInt(id) });
    
        if(!patient){
            return res.status(404).json({ error: "Patient not found" });
        }


        // uuendame andmed objektis (lokaalne muudatus)
        patient.title = title ? title: patient.title;
        patient.body = body ? body : patient.body;

        // otsime üles autori, kellele artikkel kuulub
        if(!doctorId){
            const doctor = await Doctor.findOneBy({id: doctorId});
            if(!doctor){
                return res.status(400).json({ message: "Doctor with given ID not found"});
        }
        patient.doctorId = doctor.id;
        }

        // salvestame muudatused andmebaasi
        const result = await patient.save();

        // saadame vastu uuendatud andmed (kui midagi töödeldakse serverid, on vaja seda kuvada)
        return res.status(200).json({ data: result });
        } catch(error) {
        console.log("ERROR", { message: error });
        
        // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
        return res.status(500).json({ message: "Could not update patients"});
    }
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
    
        const patient = await defaultDataSource
            .getRepository(Patient)
            .findOneBy({ id : parseInt(id) });
    
        if(!patient){
            return res.status(404).json({ error: "Patient not found" });
        }

        const result = await patient.remove();

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch(error) {
        console.log("ERROR", { message: error });
        
        // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
        return res.status(500).json({ message: "Could not update patients"});
    }
});

export default router;