import Mail from "../../lib/Mail";

export default {
  key: "WelcomeEmailJob",
  async handle({ data }) {
    const { email, name } = data;

    await Mail.send({
      to: email,
      subject: "Bem-vindo(a)",
      text: `Olá, ${name}, seja bem-vindo(a) ao sistema!`,
    });

    console.log(`Email de boas-vindas enviado para ${name}`);
  },
};
