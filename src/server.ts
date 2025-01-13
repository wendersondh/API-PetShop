import express from "express";
import { 
    adicionarPetshop, 
    verificarFormatoCnpj, 
    verificarCnpjJaCadastrado, 
    verificarContaExistente 
}from "./controller/petshop.controller";

import { 
    atualizarPet, 
    listarTodosPets, 
    adicionarPet, 
    atualizarVacina, 
    deletarPet
} from "./controller/pet.controller";

import cors from "cors";

export type Pet = {
    id: string;
    name: string;
    type: string;
    description: string;
    vacinated: boolean;
    deadline_vacination: Date;
    created_at: Date;
};

export type PetShop = {
    id: string;
    name: string;
    cnpj: string;
    pets: Pet[];
};

export let petShops: PetShop[] = [];


const server = express();
server.use(cors());
server.use(express.json());

// Rotas
server.post("/petshops", verificarFormatoCnpj, verificarCnpjJaCadastrado, adicionarPetshop);
server.get("/pets", verificarContaExistente, listarTodosPets);
server.post("/pets", verificarContaExistente, adicionarPet);
server.put("/pets/:id", verificarContaExistente, atualizarPet);
server.patch("/pets/:id", verificarContaExistente, atualizarVacina);
server.delete("/pets/:id", verificarContaExistente, deletarPet);



server.listen("3001", () =>
    console.log("server online on port 3001")
);

