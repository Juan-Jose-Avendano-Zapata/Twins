import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Keyboard } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import searchStyles from '../styles/searchStyles';
import homeStyles from '../styles/homeStyles';
import { theme } from '../styles/theme';

const USERS = [
  { id: '1', name: 'Juan Pérez', username: '@juanp' },
  { id: '2', name: 'María López', username: '@marial' },
  { id: '3', name: 'Dev Twins', username: '@devtwins' },
  { id: '4', name: 'Carlos Ruiz', username: '@carlosr' },
];

export default function Search({ navigation }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  const filteredUsers = USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
  );

  const handleCancelSearch = () => {
    setIsFocused(false);
    Keyboard.dismiss();
    inputRef.current?.blur();
    setQuery('');
  };

  return (
    <View style={searchStyles.container}>
      {/* HEADER */}
      <View style={homeStyles.header}>
        {/* Mostrar ícono de perfil o flechita dependiendo del foco */}
        {isFocused ? (
          <IconButton
            icon="arrow-left"
            size={28}
            onPress={handleCancelSearch}
          />
        ) : (
          <IconButton
            icon="account-circle-outline"
            size={30}
          />
        )}

        {/* Barra de búsqueda */}
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <TextInput
            ref={inputRef}
            placeholder="Search users"
            mode="outlined"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            left={<TextInput.Icon icon="magnify" />}
            style={searchStyles.input}
            outlineStyle={searchStyles.inputOutline}
            theme={{
              colors: {
                primary: theme.Colors.primaryLight,
                text: theme.Colors.text.primary,
                placeholder: theme.Colors.text.secondary,
              },
            }}
          />
        </View>

        {/* Ícono de configuración solo si no está enfocada la barra */}
        {!isFocused && (
          <IconButton
            icon="cog-outline"
            size={30}
          />
        )}
      </View>

      {/* RESULTADOS */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={searchStyles.userItem}
            onPress={() => console.log('Ver perfil de', item.username)}
          >
            <Image
              source={require('../assets/img/logoTW.png')}
              style={searchStyles.avatar}
            />
            <View>
              <Text style={searchStyles.userName}>{item.name}</Text>
              <Text style={searchStyles.userUsername}>{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={searchStyles.noResults}>
            {query ? 'No users found.' : 'Start typing to search.'}
          </Text>
        }
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
      />

      {/* MENÚ INFERIOR */}
      <View style={homeStyles.menu}>
        <IconButton icon="home" size={24} onPress={() => navigation.navigate('Home')} />
        <IconButton icon="magnify" size={24} onPress={() => navigation.navigate('Search')} />
        <IconButton icon="bell-outline" size={24} />
        <IconButton icon="email-outline" size={24} />
        <IconButton icon="logout" size={24} onPress={() => navigation.navigate('Main')} />
      </View>
    </View>
  );
}
