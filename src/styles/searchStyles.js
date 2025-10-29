// src/styles/searchStyles.js
import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
import { theme } from './theme';

const searchStyles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    paddingTop: 20,
    paddingBottom: 20,
  },

  input: {
    ...baseStyles.input,
    marginBottom: theme.Spacing.medium,
    borderRadius: 25,
    paddingHorizontal: theme.Spacing.small,
  },

  inputOutline: {
    ...baseStyles.inputOutline,
    borderColor: theme.Colors.primaryLight,
    borderRadius: 25,
    borderWidth: 1,
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.Spacing.small,
    borderBottomColor: theme.Colors.surface,
    borderBottomWidth: 1,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: theme.Spacing.small,
  },

  userName: {
    color: theme.Colors.text.primary,
    fontSize: theme.Typography.body.fontSize,
    fontWeight: 'bold',
  },

  userUsername: {
    color: theme.Colors.text.secondary,
    fontSize: theme.Typography.caption.fontSize,
  },

  noResults: {
    color: theme.Colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.Spacing.large,
  },
});

export default searchStyles;
