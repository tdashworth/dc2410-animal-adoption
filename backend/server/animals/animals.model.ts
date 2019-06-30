import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

export enum AnimalType {
  Cat,
  Dog,
  Bird,
  Pig,
}

export enum Gender {
  Male,
  Female,
}

export interface IAnimal {
  name: string;
  type: AnimalType;
  dob: Date;
  description: string;
  gender: Gender;
  picture?: string;
  adoptedBy?: string;
}

export interface IAnimalModel extends IAnimal, mongoose.Document { }

// tslint:disable-next-line:variable-name
export const AnimalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: AnimalType, required: true },
    dob: { type: Date, required: true },
    description: { type: String, required: true },
    gender: { type: Gender, required: true },
    picture: { type: String, required: false },
    adoptedBy: { type: String, required: false },
  },
  { strict: 'throw' },
);

AnimalSchema.pre('save', async function (this: IAnimalModel) {
  this.name = sanitizeHtml(this.name);
  this.description = sanitizeHtml(this.description);
});

// tslint:disable-next-line:variable-name
const Animal = mongoose.model<IAnimalModel>('Animal', AnimalSchema);

export default class Animals {

  static create(newAnimal: IAnimal): Promise<IAnimalModel> {
    return new Animal(newAnimal).save();
  }

  static get(id: any): Promise<IAnimalModel | null> {
    if (!(typeof(id) === 'string')) return Promise.resolve(null);
    return Animal.findById(id).exec();
  }

  static listAll(): Promise<IAnimalModel[]> {
    return Animal.find({}).exec();
  }

  static listAllAvailable(): Promise<IAnimalModel[]> {
    return Animal.find({ adoptedBy: null }).exec();
  }

  static async update(id: any, updatedAnimal: any) {
    if (!(typeof(id) === 'string')) return Promise.resolve(null);
    const orginal = await this.get(id);
    if (orginal !== null && orginal.adoptedBy === null) {
      throw new Error('Animal is locked because it has already been adopted.');
    }

    return Animal.findOneAndUpdate(id, updatedAnimal).exec();
  }

  static delete(id: any) {
    return Animal.findByIdAndDelete(id).exec();
  }

  static deleteAll() {
    return Animal.deleteMany({}).exec();
  }

  static disconnect() {
    return mongoose.disconnect();
  }
}