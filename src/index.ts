import "reflect-metadata";
import { config } from "dotenv";
config();
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection, useContainer } from "typeorm";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import connectRedis from "connect-redis";
import session from "express-session";
import { redis } from "./redis";
import cors from "cors";
import { Container } from "typeorm-typedi-extensions";
// import passport, { Profile } from "passport";
// import { google } from "./google";
// import { Strategy, VerifyCallback } from "passport-google-oauth20";

declare module 'express-session' {
  interface SessionData {
    userId: any;
  }
}

const main = async () => {
  useContainer(Container);
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + '/modules/**/*.ts'],
    container: Container,
  });


  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error && error.extensions) {
        error.extensions.code = 'GRAPHQL_VALIDATION_FAILED';
      }
      return error;
    },
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await apolloServer.start();

  const app = express();
  const RedisStore = connectRedis(session);
  
  app.use(cors());

  // /**
  //  * Passport Setup
  //  */
  // app.use(passport.initialize())

  // passport.use(
  //   new Strategy(
  //     google,
  //     async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  //       console.log(accessToken)
  //       console.log(refreshToken)
  //       console.log(profile)
  //       console.log("Profile: " + profile.id)
  //       return done(null, profile);
  //     }
  //   )
  // )

  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: "qid",
      secret: "duas890du98uvxcivno0894f",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();