import type { Request, Response, NextFunction } from 'express';
import { petFilterSchema, petProfileUpdateSchema, adoptPetSchema } from './pet.schema';
import type { PetService } from './pet.service';
import { toPetId } from '../shared/PetId';
import { PetNotFoundError } from '../shared/PetErrors';
import { PetAlreadyAdoptedError } from '../shared/PetErrors';

export class PetController {
  constructor(private readonly petService: PetService) {
    this.listPets = this.listPets.bind(this);
    this.getPetProfile = this.getPetProfile.bind(this);
    this.updatePetProfile = this.updatePetProfile.bind(this);
    this.markPetAdopted = this.markPetAdopted.bind(this);
  }

  async listPets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { species } = petFilterSchema.parse(req.query);
      const pets = await this.petService.listBySpecies(species);
      res.json(pets);
    } catch (err) {
      next(err);
    }
  }

  async getPetProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const petId = toPetId(req.params.petId);
      const latStr = req.headers['x-customer-lat'];
      const lonStr = req.headers['x-customer-lon'];
      const customerLocation =
        latStr && lonStr
          ? { latitude: parseFloat(latStr as string), longitude: parseFloat(lonStr as string) }
          : undefined;
      const profile = await this.petService.getProfile(petId, customerLocation);
      res.json(profile);
    } catch (err) {
      if (err instanceof PetNotFoundError) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }
      next(err);
    }
  }

  async updatePetProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const petId = toPetId(req.params.petId);
      const update = petProfileUpdateSchema.parse(req.body);
      const profile = await this.petService.updateProfile(petId, update);
      res.json(profile);
    } catch (err) {
      if (err instanceof PetNotFoundError) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }
      next(err);
    }
  }

  async markPetAdopted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const petId = toPetId(req.params.petId);
      adoptPetSchema.parse(req.body);
      await this.petService.markAdopted(petId);
      res.status(204).send();
    } catch (err) {
      if (err instanceof PetNotFoundError) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }
      if (err instanceof PetAlreadyAdoptedError) {
        res.status(409).json({ error: 'Pet is already adopted' });
        return;
      }
      next(err);
    }
  }
}
