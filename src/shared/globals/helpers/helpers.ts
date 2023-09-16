export class Helpers {
  static firstLetterUppercase(str: string): string {
    const valueStr = str.toLowerCase();
    return valueStr
      .split(' ')
      .map((v: string) => `${v.charAt(0).toUpperCase()}${v.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result, 10);
  }
}
