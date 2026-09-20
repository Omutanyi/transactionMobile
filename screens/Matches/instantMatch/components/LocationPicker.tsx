import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { MatchLocation, Shop } from '../../../../types';

interface Props {
  location: MatchLocation;
  onChangeLocation: (location: MatchLocation) => void;
  shops: Shop[];
  shopsLoading: boolean;
  selectedShopId: string | null;
  onSelectShop: (shop: Shop) => void;
}

/**
 * Lets the player declare where they are playing. Choosing "In-Shop" reveals
 * the shop picker so nearby players and the chalkman can be scoped correctly.
 */
const LocationPicker: React.FC<Props> = ({
  location,
  onChangeLocation,
  shops,
  shopsLoading,
  selectedShopId,
  onSelectShop,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const options: { id: MatchLocation; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { id: 'online', label: 'Online', icon: 'globe-outline' },
    { id: 'shop', label: 'In a Shop', icon: 'storefront-outline' },
  ];

  return (
    <>
      <View style={styles.segRow}>
        {options.map(option => {
          const active = location === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.segItem, active && styles.segItemActive]}
              onPress={() => onChangeLocation(option.id)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={option.icon}
                size={15}
                color={active ? theme.primary : theme.subText}
              />
              <Text style={[styles.segLabel, active && styles.segLabelActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {location === 'shop' && (
        <View style={styles.shopCard}>
          {shopsLoading ? (
            <View style={styles.opponentHeader}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.opponentEmpty, { marginLeft: 8 }]}>
                Finding shops near you…
              </Text>
            </View>
          ) : shops.length > 0 ? (
            shops.map(shop => {
              const active = selectedShopId === shop.id;
              return (
                <TouchableOpacity
                  key={shop.id}
                  style={[styles.shopRow, active && styles.shopRowActive]}
                  onPress={() => onSelectShop(shop)}
                  activeOpacity={0.85}
                >
                  <View style={styles.shopIconWrap}>
                    <Ionicons
                      name="storefront-outline"
                      size={15}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.shopInfo}>
                    <Text style={styles.shopName}>{shop.name}</Text>
                    <Text style={styles.shopMeta} numberOfLines={1}>
                      {shop.address ?? 'On site'}
                      {shop.chalkmanName ? ` • ${shop.chalkmanName} on duty` : ''}
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
            <Text style={styles.shopEmpty}>
              No shops available right now. You can still play online, or start an
              open match and add opponents by invite code.
            </Text>
          )}
        </View>
      )}
    </>
  );
};

export default LocationPicker;
