export class PetPhotoGallery {
  private readonly photos: string[];

  constructor(photos: string[] = []) {
    this.photos = [...photos];
  }

  get urls(): readonly string[] {
    return this.photos;
  }

  addPhoto(url: string): PetPhotoGallery {
    return new PetPhotoGallery([...this.photos, url]);
  }

  removePhoto(url: string): PetPhotoGallery {
    return new PetPhotoGallery(this.photos.filter((u) => u !== url));
  }

  toJSON(): string[] {
    return [...this.photos];
  }

  static fromJSON(photos: string[]): PetPhotoGallery {
    return new PetPhotoGallery(photos);
  }
}
