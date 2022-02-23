import { Coin, coin } from "@cosmjs/proto-signing";
import { config } from "./config";

export function toMicroAmount(amount: string) {
  return String(
    Number.parseFloat(amount) *
      Math.pow(10, Number.parseInt(config("coinDecimals")))
  );
}

export function fromMicroAmount(amount: string) {
  return String(
    Number.parseInt(amount) /
      Math.pow(10, Number.parseInt(config("coinDecimals")))
  );
}

export function fromMicroDenom(udenom: string): string {
  return udenom.replace("u", "");
}

export function toMicroDenom(denom: string): string {
  return `u${denom}`;
}

export function amountToCoin(amount: string | number): Coin {
  return coin(amount, config("coinDenom"));
}

export function coinToString(coin: Coin): string {
  return `${fromMicroAmount(coin.amount)}${fromMicroDenom(coin.denom)}`;
}
