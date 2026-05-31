import { Router } from 'express';
import type { PetProfileController } from './pet-profile.controller';

export function createPetProfileRouter(controller: PetProfileController): Router {
  const router = Router();
  router.get('/account/pets', controller.list);
  router.post('/account/pets', controller.create);
  router.patch('/account/pets/:id', controller.update);
  router.delete('/account/pets/:id', controller.delete);
  return router;
}
