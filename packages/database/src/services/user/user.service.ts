import { UserModel } from '../../models/user';
import { User } from '@repo/shared/schema';

 class UserService {

    constructor(private readonly model: typeof UserModel) {}

    async createUser(user: Omit<User, 'id'>): Promise<User> {

        console.log(user, 'user');
        const newUser = await this.model.create(user);
        return newUser;
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.model.findById(id).select('-password -salt');
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

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.model.findOne({ email });
        return user;
    }
}

export const userService = new UserService(UserModel);