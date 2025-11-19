// src/styles/searchStyles.js
import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
import { theme } from './theme';

const searchStyles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    paddingTop: 20,
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
    paddingHorizontal: theme.Spacing.medium,
    borderBottomColor: theme.Colors.surface,
    borderBottomWidth: 1,
  },

  userInfo: {
    flex: 1,
    marginLeft: theme.Spacing.small,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },

  userName: {
    color: theme.Colors.text.primary,
    fontSize: theme.Typography.body.fontSize - 2,
    fontWeight: 'bold',
  },

  userUsername: {
    color: theme.Colors.text.secondary,
    fontSize: theme.Typography.caption.fontSize,
  },

  followButton: {
    paddingHorizontal: theme.Spacing.medium,
    paddingVertical: theme.Spacing.small + 2,
    borderRadius: 20,
    backgroundColor: theme.Colors.primary,
  },

  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.Colors.border,
  },

  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: theme.Typography.caption.fontSize,
  },

  followingButtonText: {
    color: theme.Colors.text.primary,
  },

  listContent: {
    paddingBottom: 80,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },

  noResults: {
    color: theme.Colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.Spacing.large,
    fontSize: theme.Typography.body.fontSize,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },

  loadingText: {
    color: theme.Colors.text.secondary,
    marginTop: theme.Spacing.medium,
    fontSize: theme.Typography.body.fontSize,
  },
});

export default searchStyles;