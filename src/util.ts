import { Amount } from '@vigcoin/crypto';
import { uint64, usize } from '@vigcoin/types';
import { assert } from 'console';

export function getReward(
  medianSize: usize,
  currentBlockSize: usize,
  alreadyGeneratedCoins: uint64,
  fee: uint64,
  parameters: { [x: string]: number }
) {
  assert(alreadyGeneratedCoins <= parameters.MONEY_SUPPLY);
  assert(parameters.EMISSION_SPEED_FACTOR > 0);
  assert(parameters.EMISSION_SPEED_FACTOR <= 8 * 8);
  // tslint:disable-next-line:no-bitwise
  let baseReward =
    // tslint:disable-next-line:no-bitwise
    (parameters.MONEY_SUPPLY - alreadyGeneratedCoins) >>>
    parameters.EMISSION_SPEED_FACTOR;
  if (alreadyGeneratedCoins === 0) {
    baseReward =
      (parameters.MONEY_SUPPLY * parameters.PREMINED_PERCENTAGE) / 100;
  }
  if (alreadyGeneratedCoins + baseReward >= parameters.MONEY_SUPPLY) {
    baseReward = 0;
  }
  if (medianSize < parameters.CRYPTONOTE_BLOCK_GRANTED_FULL_REWARD_ZONE) {
    medianSize = parameters.CRYPTONOTE_BLOCK_GRANTED_FULL_REWARD_ZONE;
  }

  if (currentBlockSize > 2 * medianSize) {
    return false;
  }

  const penalizedBaseReward = Amount.getPenalized(
    baseReward,
    medianSize,
    currentBlockSize
  );
  const penalizedFee = Amount.getPenalized(fee, medianSize, currentBlockSize);
  const emission = penalizedBaseReward - (fee - penalizedFee);
  const reward = penalizedBaseReward + penalizedFee;
  return {
    emission,
    reward,
  };
}
