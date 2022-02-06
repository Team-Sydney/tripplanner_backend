import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/User";
import { RegisterInput } from "../modules/user/register/RegisterInput";

@Service()
export class UserService {

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email: email } });

<<<<<<< HEAD
    if (!user) {
      throw new Error("User could not be found.")
=======
    if(!user) {
      return undefined;
>>>>>>> 14882e2b1677a9d8053374c6d60c97ede159872f
    }

    return user;
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
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

  // async registerUserWithGoogle(accessTokenTest: string) {
  //   console.log(accessTokenTest)
  //   const user = new User();


  //   async (accessToken, refreshToken, profile) => {

  //     accessToken = accessTokenTest
  //     console.log(refreshToken)
  //     console.log("hi")
  //     //Check if user exists
  //     this.verify(accessToken).catch(console.error);

  //     user.firstName = profile.name?.givenName!;
  //     user.lastName = profile.name?.familyName!;
  //     user.email = profile.emails![0].value;

  //     await this.userRepository.save(user)
  //   }
  //   )
  //   );

  //   return user;
  // }
  /**
    * Google auth library
    */

  // async verify(idToken: string) {
  //   const ticket = await client.verifyIdToken({
  //     idToken: idToken,
  //     audience: process.env.GOOGLE_CLIENT_ID,
  //   });
  //   const payload: TokenPayload = ticket.getPayload()!;
  //   const userid = payload['sub'];
  //   console.log("test: " + userid)
  //   // If request specified a G Suite domain:
  //   // const domain = payload['hd'];
  // }
}