export const getCepData = async (cep: string) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }
    return data;
  } catch (error) {
    throw new Error("Erro ao buscar dados do CEP.");
  }
};
