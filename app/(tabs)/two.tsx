import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
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

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [userId])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const savedUsers = await AsyncStorage.getItem('users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const user = users.find((u: UserProfile) => u.id === userId);
        if (user) {
          setProfile(user);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (nome: string, sobrenome: string) => {
    return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com gradiente e avatar */}
      <View style={[styles.header, { backgroundColor: profile.cor }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(profile.nome, profile.sobrenome)}</Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{profile.nome} {profile.sobrenome}</Text>
        <Text style={styles.userTitle}>{profile.curso || 'Sem curso definido'}</Text>
        
        <View style={styles.editHint}>
          <Text style={styles.editHintText}>Role para baixo para ver mais informações</Text>
        </View>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>N</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome Completo</Text>
                <Text style={styles.infoValue}>{profile.nome} {profile.sobrenome}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>I</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Idade</Text>
                <Text style={styles.infoValue}>{profile.idade || 'Não informado'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações Acadêmicas</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>U</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Instituição</Text>
                <Text style={styles.infoValue}>{profile.instituicao || 'Não informado'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>C</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Curso</Text>
                <Text style={styles.infoValue}>{profile.curso || 'Não informado'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botão de edição destacado */}
        <View style={styles.editSection}>
          <Text style={styles.editSectionTitle}>Quer editar este perfil?</Text>
          <Text style={styles.editSectionSubtitle}>Toque no botão abaixo para modificar as informações</Text>
          
          <Link href={`/modal?userId=${profile.id}`} asChild>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: profile.cor }]}>
              <Text style={styles.editButtonText}>✏️ EDITAR PERFIL</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  editHint: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  editHintText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  userTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  headerDecoration: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
  },
  decorationWave: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 5,
  },
  decorationWave2: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -20,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  editSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  editSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  editSectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  editButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
