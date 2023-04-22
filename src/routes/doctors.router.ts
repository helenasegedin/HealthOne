import express from 'express';
import defaultDataSource from '../datasource';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';

const router = express.Router();

interface CreateDoctorParams {
    firstName: string;
    lastName: string;
    title: string;
}

interface UpdateDoctorParams {
    firstName?: string;
    lastName?: string;
    title?: string;
}

// GET - info päring (kõik artiklid)
router.get("/", async(req, res) => {
    try {
        // küsi artiklid andmebaasist
        const Doctors = await defaultDataSource.getRepository(Doctor).find();
  
        // vasta artiklite kogumikuga JSON formaadis
        return res.status(200).json({ data: Doctors });
      } catch (error) {
        console.log("ERROR", { message: error });
  
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not fetch Doctors" });
      } 
});


// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { title, firstName, lastName} = req.body as CreateDoctorParams;

    // TODO: validate & sanitize
    if(!title || !firstName || !lastName) {
    return res
        .status(400)
        .json({ error: "Doctor has to have first name, last name and title"});
    }


        // create new doctor with given parameters
        const doctor = Doctor.create({
            title: title.trim() ?? "",
            firstName: firstName.trim() ?? "",
            lastName: lastName.trim() ?? "",
            // doctor: doctor,
        });

        // save doctor to database
        const result = await doctor.save();

        return res.status(200).json({data: result});
    } catch (error) {
        console.log("ERROR", { message: error });
        
    // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
    return res.status(500).json({ message: "Could not fetch doctors" });        
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;
    
    // tavaline ORM päring koos "relation" entity sisuga
    const doctor = await defaultDataSource
    .getRepository(Doctor)
    .findOne({ where:{id: parseInt(id)}, relations: ['patients'] });

    // Querybuilderiga tehtud samalaadne päring (left join'i tõttu hetkel ainult 1)
    // const doctorPatients = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("doctor", "doctor")
    // .leftJoin("patient", "patients", "patients.doctorId = doctor.id")
    // .where("doctor.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:doctorPatients.id,
    //     firstName:doctorPatients.firstName,
    //     lastName: doctorPatients.lastName,
    //     patient: {
    //         title: doctorPatients.title,
    //         body: doctorPatients.body,
    //     }
    // }});
    
    return res.status(200).json({ data: doctor });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
    return res.status(500).json({ message: "Could not fetch doctors" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try{
    const { id } = req.params;
    const { title, firstName, lastName } = req.body as UpdateDoctorParams;
    
    const doctor = await defaultDataSource
    .getRepository(Doctor)
    .findOneBy({ id : parseInt(id) });
    
    if(!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    doctor.title = title ? title: doctor.title;
    doctor.firstName = firstName ? firstName : doctor.firstName;
    doctor.lastName = lastName ? lastName : doctor.lastName;
    
    // salvestame muudatused andmebaasi
    const result = await doctor.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serverid, on vaja seda kuvada)
    return res.status(200).json({ data: result });
} catch(error) {
    console.log("ERROR", { message: error });
        
    // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
    res.status(500).json({ message: "Could not update doctors"});
    }
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;
            
        const doctor = await defaultDataSource
            .getRepository(Patient)
            .findOneBy({ id : parseInt(id) });
    
        if(!doctor){
            return res.status(404).json({ error: "Doctor not found" });
        }

        const result = await doctor.remove();

        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
        } catch(error) {
        console.log("ERROR", { message: error });
        
        // vasta süsteemi veaga, kui andmebaasipäringu jooksul tekib ootamatu viga
        res.status(500).json({ message: "Could not update doctors"});
    }
});

export default router;