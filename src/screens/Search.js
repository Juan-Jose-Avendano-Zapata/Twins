import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { TextInput, IconButton, FAB } from 'react-native-paper';
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
    user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()),
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
        {/* Ícono de perfil o flecha atrás */}
        {isFocused ? (
          <IconButton
            icon="arrow-left"
            size={28}
            onPress={handleCancelSearch}
          />
        ) : (
          <IconButton icon="account-circle-outline" size={30} />
        )}

        {/* Barra de búsqueda */}
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <TextInput
            ref={inputRef}
            placeholder="Buscar usuarios"
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

        {/* Ícono de configuración solo si no está buscando */}
        {!isFocused && <IconButton icon="cog-outline" size={30} />}
      </View>

      {/* RESULTADOS */}
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
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
            {query
              ? 'No se encontraron usuarios.'
              : 'Empieza a escribir para buscar.'}
          </Text>
        }
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
      />

      {/* FAB: oculto mientras el campo está enfocado o hay texto */}
      {!isFocused && query.length === 0 && (
        <FAB
          icon="feather"
          color="white"
          style={homeStyles.fabCreate}
          onPress={() => navigation.navigate('CreatePost')}
        />
      )}

      {/* MENÚ INFERIOR */}
      <View style={homeStyles.menu}>
        <IconButton
          icon="home"
          size={24}
          onPress={() => navigation.navigate('Home')}
        />
        <IconButton
          icon="magnify"
          size={24}
          onPress={() => navigation.navigate('Search')}
        />
        <IconButton icon="bell-outline" size={24} />
        <IconButton icon="email-outline" size={24} />
        <IconButton
          icon="logout"
          size={24}
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    </View>
  );
}
