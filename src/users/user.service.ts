import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(username: string, password: string): Promise<UserDocument> {
        try {
            const newUser = new this.userModel({ username, password });
            return newUser.save();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        try {
            return this.userModel.findOne({ username }).exec();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
