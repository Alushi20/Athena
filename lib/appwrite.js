import { Client, Account, Databases, Storage } from "react-native-appwrite";

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '67bb632a001de339c317',
    dbId:"67bc1b9400215f978730",
    col:{
        usersCol: "users",
        mentorshipMatchesCol: "mentorshipMatches",
        mentorshipSessionsCol: "mentorshipSessions",
        mentorshipFeedbackCol: "mentorshipFeedback",
    },
    storageId: "663116970003f56e9c69"
};

const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId);

const account = new Account(client);
const storage = new Storage(client);
const database = new Databases(client);

export { account, storage, database, client };
