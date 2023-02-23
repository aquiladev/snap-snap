import { Erc20Token } from '@aquiladev/bls-snap/src/types/snapState';
import { ethers } from 'ethers';
import { KeyboardEvent } from 'react';
import { Erc20TokenBalance } from '../types';
import { TIMEOUT_DURATION } from './constants';

export const shortenAddress = (address: string, num = 3) => {
  if (!address) {
    return '';
  }
  return (
    Boolean(address) &&
    `${address.substring(0, num + 2)}...${address.substring(
      address.length - num - 1,
    )}`
  );
};

export const getMaxDecimals = (asset: Erc20TokenBalance) => {
  const MAX_DECIMALS = 6;
  if (asset.decimals > MAX_DECIMALS) {
    return MAX_DECIMALS;
  }
  return asset.decimals;
};

export const getAmountPrice = (
  asset: Erc20TokenBalance,
  assetAmount: number,
  usdMode: boolean,
) => {
  if (asset.usdPrice) {
    // eslint-disable-next-line no-negated-condition
    if (!usdMode) {
      const result = asset.usdPrice * assetAmount;
      return result.toFixed(2).toString();
    }

    const result = assetAmount / asset.usdPrice;
    return result.toFixed(getMaxDecimals(asset)).toString();
  }
  return '';
};

export const isSpecialInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
  return (
    event.key === 'Backspace' ||
    event.ctrlKey ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft' ||
    event.metaKey
  );
};

export const addMissingPropertiesToToken = (
  token: Erc20Token,
  chainId: number,
  balance?: string,
  usdPrice?: number,
): Erc20TokenBalance => {
  return {
    ...token,
    chainId,
    amount: ethers.BigNumber.from(balance || '0x0'),
    usdPrice,
  };
};

export const fetchWithTimeout = async (
  resource: string,
  options = { timeout: TIMEOUT_DURATION },
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), options.timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

export const getDate = (date: number, options?: any) => {
  const config = options || { month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', config);
};

export const getFunctionName = (functionName: string) => {
  let name = functionName;
  if (name.includes('function')) {
    name = name.slice(8);
  }
  const indexBracket = name.indexOf('(');
  name = name
    .slice(0, indexBracket)
    .trim()
    .replace(/([A-Z])/u, ' $1');
  name = name[0].toUpperCase() + name.slice(1);
  return name;
};
