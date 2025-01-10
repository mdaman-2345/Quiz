import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(username: string, password: string): Promise<UserDocument> {
        const newUser = new this.userModel({ username, password });
        return newUser.save();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }
}
