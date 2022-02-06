
## ✨ Inspiration

Since the hackathon theme was restoration, our project idea was to create an app that helps people plan out trips, with COVID **hopefully** coming to an end! Often times in the past, planning trips with friends can be painful, always sending them hotel listings for approval and waiting for them to approve it etc, sometimes being unorganized, you get the gist!

We're calling this **Viato**. Ready to plan trips out with friends and family? ***Viato*** is the way.

## 📜 What it does
Viato is a **cross-platform mobile app** that allows you to create a trip with a group of friends to plan it out together.  After creating a trip, you can invite your friends, add activities such as attractions, restaurants, hotels, transportation, and more to your trip! Your group can vote/approve each activity before it's officially added to your itinerary. After planning, you're able to view a beautiful overall timeline :)

## 💻 How we built it

**Back-end:** Node.js, TypeScript, Apollo/GraphQL, CockroachDB (PostgreSQL), TypeORM, Redis (Sessions!)
**Front-end/Mobile App:** Flutter (Dart) - Available for both iOS and Android

We decided to use GraphQL as opposed to the usual REST API. For most of our lives as a software developer, we've been creating REST APIs, it's time to try something else and GraphQL was perfect. It's great and we highly recommend giving it a shot. No more creating endpoints for every tiny thing.


## 🤯Challenges we ran into
In the hackathons we've attended in the past, our challenge often is planning out the database. Unfortunately to say, that's the same challenge we encountered. 

Another challenge of ours is  we are quite ambitious, we want to build a lot in 36 hours, sometimes it's hard to scope down what we really need.

## 🎉Accomplishments that we're proud of
- Deployed our back-end to DigitalOcean for the first time!
- Balancing a life and a hackathon at the same time, we didn't stay up for the full 36 hours like previous hackathons. We've managed to get a lot done in the time we developed.
- Yelling at each other to finish things faster
- Proud of Jacob for making a damn beautiful user interface
- Creating a full on GraphQL API with user auth and most important features


## 👨‍🎓What we learned
- Planning helps so much before you start coding
- GraphQL is a lot better than a REST API
- How to integrate social auth into an application
- How to yell at each other when we have problems
- How to shed some tears when we fix a bug that shouldn't have taken 1 hour
- You don't need to stay up for the full 36 hours to make a fun / useful project :)


## 🤔What's next for Viato
- Automatically split bills between members
- Allow multiple forms of social authentication
- Utilize Google Maps API or something else for destinations
- Push Notifications to notify users if approval is needed etc

## Installation
1. Run `npm install`
2. Create .env file with the following environment variables. The default port for the database is 26257 which is located in ormconfig.json. There is no environment variable for that so if it's different than the above, change it there.

    DB_HOST=
    DB_USERNAME=
    DB_PASSWORD= 
    DB_DATABASE= 
    REDIS_HOST=
    REDIS_USERNAME=
    REDIS_PASSWORD=
    REDIS_PORT=

3. Run npm run start
4. Voila, the Viato / Trip Planner back-end is now running!

