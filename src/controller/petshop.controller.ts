import e, { Request, Response, NextFunction } from "express";
import {v4 as criarId} from "uuid";
import {Pet, PetShop, petShops} from "../server";


export function adicionarPetshop(req: Request, res: Response) {
    const dados = req.body as PetShop;

    const petshop: PetShop | null = {
        id: criarId(),
        name: dados.name,
        cnpj: dados.cnpj,
        pets: []
    }

    if(!petshop) {
        res.status(404).json({error: "Petshop nao cadastrado!"});
        return;
    }
    petShops.push(petshop);

    res.status(201).json(petshop);
    return;
}


// MIDDLEWARES

export function verificarCnpjJaCadastrado(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.body.cnpj;
    const petshop = petShops.find((petshop) => petshop.cnpj === cnpj);
    if (petshop) {
        res.status(404).json({error: "Petshop já cadastrado!"});
        return;
    }
    
    next();
};

export function verificarFormatoCnpj(req: Request, res: Response, next: NextFunction) {

     const formato = /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/;
     const cnpj = req.body.cnpj;

     if(!formato.test(cnpj)) {
         res.status(400).json({error: "Formato de CNPJ inválido!"});
         return;
     }

     next();

}

export function verificarContaExistente(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.headers.cnpj;
    const petshop = petShops.find((petshop) => petshop.cnpj === cnpj);
    if (!petshop) {
        res.status(404).json({error: "Petshop nao cadastrado!"});
        return;
    }

    req.petshop = petshop;
    next();
}
