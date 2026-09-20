import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { Player, WalletInfo } from '../../../../types';
import { WagerMethod } from '../types';
import {
  DEFAULT_AVATAR,
  QUICK_AMOUNTS,
  buildWagerOptions,
  formatMoney,
} from '../constants';

interface Props {
  method: WagerMethod;
  onSelectMethod: (method: WagerMethod) => void;
  amount: string;
  onChangeAmount: (value: string) => void;
  currency: 'USD' | 'KES';
  wallet: WalletInfo | null;
  chalkmen: Player[];
  selectedChalkman: Player | null;
  onSelectChalkman: (chalkman: Player) => void;
  seriesLabel: string;
}

/**
 * Wager configuration: opt out entirely, let the system hold the stake in the
 * player's wallet, or hand it to a shop attendant (chalkman) for escrow.
 */
const WagerPicker: React.FC<Props> = ({
  method,
  onSelectMethod,
  amount,
  onChangeAmount,
  currency,
  wallet,
  chalkmen,
  selectedChalkman,
  onSelectChalkman,
  seriesLabel,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const wagerOptions = buildWagerOptions({
    success: theme.success,
    info: theme.info,
    warning: theme.warning,
  });

  const amountValue = parseInt(amount || '0', 10) || 0;
  const balance = wallet?.balance ?? 0;
  const insufficient = method === 'wallet' && amountValue > balance;

  return (
    <>
      <View style={styles.wagerRow}>
        {wagerOptions.map(option => {
          const active = method === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.wagerCard,
                active && {
                  borderColor: option.color,
                  backgroundColor: option.color + '14',
                },
              ]}
              onPress={() => onSelectMethod(option.id)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.wagerIcon,
                  active && { backgroundColor: option.color + '26' },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={17}
                  color={active ? option.color : theme.subText}
                />
              </View>
              <Text
                style={[styles.wagerLabel, active && { color: option.color }]}
              >
                {option.label}
              </Text>
              <Text style={styles.wagerSub}>{option.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {method !== 'none' && (
        <>
          <View style={styles.amountRow}>
            <View style={[styles.amountWrap, insufficient && { borderColor: theme.error }]}>
              <Text style={styles.amountCurrency}>
                {currency === 'KES' ? 'KSh' : '$'}
              </Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={value => onChangeAmount(value.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={theme.subText}
                maxLength={6}
              />
              <Text style={styles.balanceText}>per player</Text>
            </View>
          </View>

          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map(quick => {
              const active = amountValue === quick;
              return (
                <TouchableOpacity
                  key={quick}
                  style={[styles.quickChip, active && styles.quickChipActive]}
                  onPress={() => onChangeAmount(String(quick))}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.quickChipText,
                      active && styles.quickChipTextActive,
                    ]}
                  >
                    ${quick}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {method === 'wallet' && (
            <View style={styles.balanceHint}>
              <Ionicons name="wallet-outline" size={13} color={theme.subText} />
              <Text style={styles.balanceText}>Wallet balance</Text>
              <Text
                style={[
                  styles.balanceValue,
                  insufficient && { color: theme.error },
                ]}
              >
                {formatMoney(balance, currency)}
              </Text>
              <Text style={styles.balanceText}>
                {insufficient
                  ? '• Not enough to cover the wager'
                  : `• ${formatMoney(amountValue, currency)} will be held in the system`}
              </Text>
            </View>
          )}

          {method === 'escrow' && (
            <View
              style={[
                styles.detailCard,
                { borderColor: theme.warning + '55' },
              ]}
            >
              <View style={styles.detailTitleRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={13}
                  color={theme.warning}
                />
                <Text style={[styles.detailTitle, { color: theme.warning }]}>
                  CHALKMAN ESCROW
                </Text>
              </View>
              <Text style={styles.detailDesc}>
                The shop attendant holds{' '}
                <Text style={{ color: theme.warning, fontWeight: '900' }}>
                  {formatMoney(amountValue, currency)}
                </Text>{' '}
                from each player until the {seriesLabel} series is settled.
              </Text>

              {chalkmen.length > 0 ? (
                chalkmen.map(chalkman => {
                  const active = selectedChalkman?.id === chalkman.id;
                  return (
                    <TouchableOpacity
                      key={chalkman.id}
                      style={[styles.selectRow, active && styles.selectRowActive]}
                      onPress={() => onSelectChalkman(chalkman)}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={
                          chalkman.avatar
                            ? { uri: String(chalkman.avatar) }
                            : DEFAULT_AVATAR
                        }
                        style={styles.selectAvatar}
                      />
                      <View style={styles.selectInfo}>
                        <Text style={styles.selectName}>{chalkman.username}</Text>
                        <Text style={styles.selectStatus}>
                          {active ? 'Selected • Ready to hold' : 'Available'}
                        </Text>
                      </View>
                      <Ionicons
                        name={active ? 'checkmark-circle' : 'ellipse-outline'}
                        size={19}
                        color={active ? theme.primary : theme.subText}
                      />
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={[styles.detailDesc, { marginTop: 6 }]}>
                  No chalkman is on duty. Switch to "In-System" to hold the wager
                  in the app instead.
                </Text>
              )}
            </View>
          )}
        </>
      )}

      {method === 'none' && (
        <View style={styles.infoBox}>
          <Ionicons name="happy-outline" size={15} color={theme.info} />
          <Text style={styles.infoText}>
            Friendly match — nothing is staked. Play as many series as you like.
          </Text>
        </View>
      )}
    </>
  );
};

export default WagerPicker;
