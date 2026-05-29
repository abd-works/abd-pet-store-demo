import { Router } from 'express';
import type { PetController } from './pet.controller';

export function createPetRouter(controller: PetController): Router {
  const router = Router();

  router.get('/api/pets', controller.listPets);
  router.get('/api/pets/:petId', controller.getPetProfile);
  router.patch('/api/pets/:petId/profile', controller.updatePetProfile);
  router.patch('/api/pets/:petId/status', controller.markPetAdopted);

  return router;
}
