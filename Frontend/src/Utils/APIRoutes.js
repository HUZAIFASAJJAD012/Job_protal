export const host = "http://localhost:800"; // Keep your API base URL here

export const loginRoute = `${host}/auth/login`;
export const registerRoute = `${host}/auth/register`;
export const logoutRoute = `${host}/auth/logout`;
export const allUsersRoute = `${host}/user/get_all_users`;
export const sendMessageRoute = `${host}/messages/addmsg`;
export const recieveMessageRoute = `${host}/messages/getmsg`;
