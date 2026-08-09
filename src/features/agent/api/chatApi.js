import api from "../../../services/api";

export const sendChatMessage = async (message, history = []) => {
  // message
  console.log("********************message********************")
  console.log(message)
  console.log("********************message********************")

  // history
  console.log("********************history********************")
  console.log(history)
  console.log("********************history********************")

  const response = await api.post("/chat", {
    message,
    history,
  });

  return response.data;
};
