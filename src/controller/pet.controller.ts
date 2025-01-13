import e, { Request, Response, NextFunction } from "express";
import {v4 as criarId} from "uuid";
import {Pet, PetShop, petShops} from "../server";
import { error } from "console";


export function listarTodosPets(req: Request, res: Response) {
    res.status(200).json(req.petshop.pets);
    return;
}

export function adicionarPet(req: Request, res: Response) {
    const dados = req.body as Pet;

    const novoPet: Pet | null = {
        id: criarId(),
        name: dados.name,
        type: dados.type,
        description: dados.description,
        vacinated: false,
        deadline_vacination: new Date(dados.deadline_vacination),
        created_at: new Date()
    }

    // Adicionar o pet ao array de pets do petshop correspondente
    const index = petShops.findIndex((petshop) => petshop.cnpj === req.petshop.cnpj);
    if(index === -1){
        res.status(404).json({error: "Petshop nao cadastrado!"});
        return;
    }
    petShops[index].pets.push(novoPet);
    

    res.status(201).json({message: "Pet cadastrado com sucesso!", pet: novoPet});
    return;
}

export function atualizarPet(req: Request, res: Response) {
    const id = req.params.id;
    const {name, type, description, deadline_vacination} = req.body;

    const petshopIndex = petShops.findIndex((petshop) => petshop.cnpj === req.petshop.cnpj);
    if(petshopIndex === -1) {
        res.status(404).json({error: "Petshop nao encontrado!"});
        return;
    }

    const petIndex = petShops[petshopIndex].pets.findIndex((pet) => pet.id === id);
    if(petIndex === -1) {
        res.status(404).json({error: "Pet nao encontrado!"});
        return;
    }

    const pet = petShops[petshopIndex].pets[petIndex];
    pet.name = name || pet.name;
    pet.type = type || pet.type;
    pet.description = description || pet.description;
    pet.deadline_vacination = deadline_vacination || pet.deadline_vacination;

    res.status(200).json({message: "Pet atualizado com sucesso!", pet});
    return;
}

export function atualizarVacina(req: Request, res: Response) {
    const id = req.params.id;
    const pet = req.petshop.pets.find((pet) => pet.id === id);

    if(!pet) {
        res.status(404).json({error: "Pet nao cadastrado!"});
        return;
    }

    pet.vacinated = !pet.vacinated;

    res.status(200).json({message: "Vacina atualizada com sucesso!", pet});
    return;
}

export function deletarPet(req: Request, res: Response) {
    const id = req.params.id;
    const pet = req.petshop.pets.find((pet) => pet.id === id);

    if(!pet) {
        res.status(404).json({error: "Pet nao cadastrado!"});
        return;
    }

    const petIndex = req.petshop.pets.findIndex((pet) => pet.id == id);
    if(petIndex === -1 || petIndex === undefined) {
        res.status(404).json({error: "Pet nao removido!"});
        return;
    }

    req.petshop.pets.splice(petIndex, 1);
    const pets = req.petshop.pets;

    res.status(200).json({message: "Pet removido com sucesso!", pets});

    return;
}
