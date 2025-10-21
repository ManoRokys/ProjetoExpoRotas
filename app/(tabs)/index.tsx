import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserProfile {
  id: string;
  nome: string;
  sobrenome: string;
  idade: string;
  instituicao: string;
  curso: string;
  avatar: string;
  cor: string;
}

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    try {
      const savedUsers = await AsyncStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Criar usuários de exemplo
        const exampleUsers: UserProfile[] = [
          {
            id: '1',
            nome: 'Ana',
            sobrenome: 'Silva',
            idade: '22',
            instituicao: 'Universidade Federal',
            curso: 'Ciência da Computação',
            avatar: '👩‍💻',
            cor: '#FF6B6B'
          },
          {
            id: '2',
            nome: 'Carlos',
            sobrenome: 'Santos',
            idade: '25',
            instituicao: 'Instituto Tecnológico',
            curso: 'Engenharia de Software',
            avatar: '👨‍💻',
            cor: '#4ECDC4'
          },
          {
            id: '3',
            nome: 'Maria',
            sobrenome: 'Oliveira',
            idade: '20',
            instituicao: 'Faculdade de Tecnologia',
            curso: 'Sistemas de Informação',
            avatar: '👩‍🎓',
            cor: '#45B7D1'
          },
          {
            id: '4',
            nome: 'João',
            sobrenome: 'Costa',
            idade: '28',
            instituicao: 'Universidade Estadual',
            curso: 'Análise e Desenvolvimento',
            avatar: '👨‍🎓',
            cor: '#96CEB4'
          },
          {
            id: '5',
            nome: 'Lucas',
            sobrenome: 'Ferreira',
            idade: '24',
            instituicao: 'Centro Universitário',
            curso: 'Ciência de Dados',
            avatar: '👨‍🔬',
            cor: '#FFEAA7'
          }
        ];
        await AsyncStorage.setItem('users', JSON.stringify(exampleUsers));
        setUsers(exampleUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleUserPress = (userId: string) => {
    router.push(`/(tabs)/two?userId=${userId}`);
  };

  const getInitials = (nome: string, sobrenome: string) => {
    return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
  };

  const handleAddUser = () => {
    // Criar novo usuário
    const newUser: UserProfile = {
      id: Date.now().toString(),
      nome: 'Novo',
      sobrenome: 'Usuário',
      idade: '',
      instituicao: '',
      curso: '',
      avatar: '👤',
      cor: '#3498db'
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    handleUserPress(newUser.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários</Text>
        <Text style={styles.subtitle}>Toque em um usuário para ver o perfil</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {users.map((user, index) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.userCard, { backgroundColor: user.cor }]}
            onPress={() => handleUserPress(user.id)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{getInitials(user.nome, user.sobrenome)}</Text>
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.nome} {user.sobrenome}</Text>
              <Text style={styles.userDetails}>{user.curso || 'Sem curso definido'}</Text>
              <Text style={styles.userInstitution}>{user.instituicao || 'Sem instituição'}</Text>
            </View>

            <View style={styles.editIndicator}>
              <Text style={styles.editIndicatorText}>✏️ TOCAR PARA EDITAR</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addUserCard} onPress={handleAddUser}>
          <Text style={styles.addUserIcon}>+</Text>
          <Text style={styles.addUserText}>Adicionar Novo Usuário</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  userCard: {
    marginBottom: 20,
    borderRadius: 25,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 3,
  },
  userInstitution: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editIndicatorText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  addUserCard: {
    backgroundColor: '#2d3748',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a5568',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addUserIcon: {
    fontSize: 32,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  addUserText: {
    fontSize: 16,
    color: '#a0a0a0',
    fontWeight: '600',
    textAlign: 'center',
  },
});
