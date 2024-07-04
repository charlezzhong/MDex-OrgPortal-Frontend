const salt: string = 'orgHashingSecret';

export const encrypt = (text: string): string => {
    const textToChars = (text: string): number[] => text.split("").map((c: string) => c.charCodeAt(0));
    const byteHex:any = (n: number): string => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar:any = (code: number): number => textToChars(salt).reduce((a: number, b: number) => a ^ b, code);
  
    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
};
  
export const decrypt = (encoded: string): string => {
    const textToChars = (text: string): number[] => text.split("").map((c: string) => c.charCodeAt(0));
    const applySaltToChar = (code: number): number => textToChars(salt).reduce((a: number, b: number) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)!
      .map((hex: string) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode: number) => String.fromCharCode(charCode))
      .join("");
};