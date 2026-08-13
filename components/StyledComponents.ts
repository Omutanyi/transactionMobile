import styled from '@emotion/native';
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native';
import { AppTheme } from '../theme';
// ...existing code...

export const AvatarImage = styled(Image)<{ theme?: AppTheme }>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border-width: 4px;
  border-color: ${({ theme }) => theme?.primary};
  background-color: ${({ theme }) => theme?.inputBackground};
`;

export const BottomContainer = styled(View)<{ theme?: AppTheme }>`
  flex: 1;
  background-color: ${({ theme }) => theme?.background};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 10px;
  margin-top: 10px;
`;

export const OptionRow = styled(TouchableOpacity)<{ theme?: AppTheme }>`
  padding-vertical: 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme?.inputBorder};
`;

export const OptionText = styled(Text)<{ theme?: AppTheme }>`
  font-size: 18px;
  color: ${({ theme }) => theme?.primary};
`;

export const DividerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 20px 0 16px 0;
`;

export const DividerLine = styled.View<{ theme?: AppTheme }>`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme?.inputBorder};
`;

export const DividerText = styled(Text)<{ theme?: AppTheme }>`
  margin: 0 12px;
  color: ${({ theme }) => theme?.inputBorder};
  font-size: 14px;
`;


export const Container = styled.View<{ theme?: AppTheme }>`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: ${({ theme }) => theme?.background};
`;

export const LogoWrapper = styled.View`
  align-items: center;
  margin-bottom: 30px;
`;

export const StyledImage = styled.Image`
  width: 100px;
  height: 100px;
  resize-mode: contain;
`;

export const StyledInput = styled.TextInput<{ theme?: AppTheme }>`
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme?.inputBorder};
  background-color: ${({ theme }) => theme?.inputBackground};
  color: ${({ theme }) => theme?.inputText};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

export const ErrorText = styled.Text<{ theme?: AppTheme }>`
  color: ${({ theme }) => theme?.error};
  margin-bottom: 10px;
`;

export const ButtonWrapper = styled.View`
  margin-bottom: 15px;
`;

export const Title = styled.Text<{ theme?: AppTheme }>`
    font-size: 28px;
    font-weight: bold;
    color:  ${({ theme }) => theme?.primary || '#007AFF'};
    text-align: center;
    margin-bottom: 24px;
`;

export const SocialRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
`;

export const SocialIconButton = styled.TouchableOpacity<{ theme?: any }>`
  margin: 0 12px;
  padding: 10px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme?.inputBackground || '#f2f2f2'};
  align-items: center;
  justify-content: center;
`;

export const LinkText = styled.Text<{ theme?: any }>`
  color: ${({ theme }) => theme?.button || '#007AFF'};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  text-decoration: underline;
  font-size: 15px;
`;

// NativeWind-friendly wrappers: use these when you want `className` (Tailwind) styles.
import { cssInterop } from 'nativewind';

export const TWContainer = cssInterop(View, { className: true });
export const TWText = cssInterop(Text, { className: true });
export const TWTouchable = cssInterop(TouchableOpacity, { className: true });
export const TWImage = cssInterop(Image, { className: true });
export const TWInput = cssInterop(TextInput, { className: true });

// Examples of usage:
// <TWContainer className="p-4 bg-transparent" />
// <TWText className="text-white text-lg" />
