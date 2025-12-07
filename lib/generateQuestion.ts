export type Question = {
  id: number;
  expression: string;
};

export const generateQuestion = (): Question => {
  const firstRandomNum = Math.floor(Math.random() * 10);
  const secondRandomNum = Math.floor(Math.random() * 10);
  // const result = firstRandomNum + secondRandomNum;
  const expression = `${firstRandomNum.toString()} + ${secondRandomNum.toString()}`;
  return { id: Math.random() * 10, expression };
};
