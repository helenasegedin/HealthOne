import http from 'http';
import app from './app';
import {config} from './config';

class Patients{
    patientName: String;
    constructor(name: String){
        this.patientName = name;
    }
    
    getInfo(){
        return `Patient ${this.patientName}`;
    }

    save(){

    }
}



app.listen(config.server.port, config.server.host, () => {
    console.log(`Server running on ${config.server.host}:${config.server.port}`);
});