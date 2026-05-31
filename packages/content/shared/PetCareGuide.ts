import { Content, type ContentFields } from './Content';
import { TagRequiredError } from './content.errors';

export type SpeciesTag = string;

export interface PetCareGuideFields extends ContentFields {
  speciesTags: SpeciesTag[];
}

export class PetCareGuide extends Content {
  speciesTags: SpeciesTag[];

  constructor(fields: PetCareGuideFields) {
    super(fields);
    this.speciesTags = [...fields.speciesTags];
  }

  requireTags(): void {
    if (this.speciesTags.length === 0) throw new TagRequiredError();
  }

  publish(at: Date): void {
    this.requireTags();
    super.publish(at);
  }

  toSnapshot(): PetCareGuideFields {
    return { ...super.toSnapshot(), speciesTags: [...this.speciesTags] };
  }
}
