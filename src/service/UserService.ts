import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/User";
import { RegisterInput } from "../modules/user/register/RegisterInput";

@Service()
export class UserService {

  @InjectRepository(User)
  private userRepository: Repository<User>; 

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if(!user) {
      throw new Error("User could not be found.")
    }

    return user;
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);

    if(!user) {
      throw new Error("User could not be found.")
    }

    return user;
  }
  
  async registerUser(input: RegisterInput): Promise<User> {
    const user = new User();

    user.firstName = input.firstName;
    user.lastName = input.lastName;
    user.email = input.email;
    
    await this.userRepository.save(user);

    return user;
  } 
}