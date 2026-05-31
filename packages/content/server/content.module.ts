import { ContentController } from './content.controller';
import { createContentRouter } from './content.routes';
import { createContentService, getSharedContentRepository, resetContentModuleForTests } from './content.service';

export function createContentModule() {
  const repository = getSharedContentRepository();
  const contentService = createContentService(repository);
  const contentController = new ContentController(contentService);
  return {
    contentService,
    contentRepository: repository,
    contentRouter: createContentRouter(contentController),
  };
}

export { resetContentModuleForTests };
