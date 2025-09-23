import { UserModel } from '../../models/user';
import { User } from '@repo/shared/schema';

export class UserService {

    constructor(private readonly model: typeof UserModel) {}

    async createUser(user: Omit<User, 'id'>): Promise<User> {
        const newUser = await this.model.create(user);
        return newUser;
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.model.findById(id);
        return user;
    }
    
    async updateUser(id: string, user: Omit<User, 'id'>): Promise<User | null> {
        const updatedUser = await this.model.findByIdAndUpdate(id, user, { new: true });
        return updatedUser;
    }

    async deleteUser(id: string): Promise<User | null> {
        const deletedUser = await this.model.findByIdAndDelete(id);
        return deletedUser;
    }
}

export const userService = new UserService(UserModel);