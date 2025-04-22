const successMessages: string[] = [];

export const logTestSuccess = (message: string) => {
  successMessages.push(`✅ Test réussi : ${message}`);
};

export const flushSuccessLogs = () => {
  if (successMessages.length > 0) {
    console.log(successMessages.join("\n"));
  }
};
