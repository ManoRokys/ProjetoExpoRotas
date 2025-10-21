import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

export default function EditProfileModal() {
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    nome: '',
    sobrenome: '',
    idade: '',
    instituicao: '',
    curso: '',
    avatar: '👤',
    cor: '#3498db',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

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

  const handleSave = async () => {
    try {
      // Validação básica
      if (!profile.nome.trim() || !profile.sobrenome.trim()) {
        Alert.alert('❌ Erro', 'Nome e sobrenome são obrigatórios');
        return;
      }

      if (profile.idade && isNaN(Number(profile.idade))) {
        Alert.alert('❌ Erro', 'Idade deve ser um número válido');
        return;
      }

      // Atualizar usuário na lista
      const savedUsers = await AsyncStorage.getItem('users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const updatedUsers = users.map((u: UserProfile) => 
          u.id === userId ? profile : u
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      Alert.alert('✅ Sucesso', 'Perfil atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('❌ Erro', 'Não foi possível salvar o perfil');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com gradiente */}
        <View style={[styles.header, { backgroundColor: profile.cor }]}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Editar Perfil</Text>
            <Text style={styles.subtitle}>Atualize suas informações</Text>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Seção de Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: profile.cor }]}>
              <Text style={styles.avatarText}>{profile.nome.charAt(0)}{profile.sobrenome.charAt(0)}</Text>
            </View>
            <Text style={styles.avatarLabel}>Iniciais do Nome</Text>
          </View>

          {/* Campos do formulário */}
          <View style={styles.fieldsContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldGroupTitle}>Informações Pessoais</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nome *</Text>
                  <TextInput
                    style={[styles.input, styles.inputHalf]}
                    value={profile.nome}
                    onChangeText={(text) => setProfile({ ...profile, nome: text })}
                    placeholder="Primeiro nome"
                    placeholderTextColor="#a0a0a0"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Sobrenome *</Text>
                  <TextInput
                    style={[styles.input, styles.inputHalf]}
                    value={profile.sobrenome}
                    onChangeText={(text) => setProfile({ ...profile, sobrenome: text })}
                    placeholder="Último nome"
                    placeholderTextColor="#a0a0a0"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Idade</Text>
                <TextInput
                  style={styles.input}
                  value={profile.idade}
                  onChangeText={(text) => setProfile({ ...profile, idade: text })}
                  placeholder="Ex: 25"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldGroupTitle}>Informações Acadêmicas</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Instituição</Text>
                <TextInput
                  style={styles.input}
                  value={profile.instituicao}
                  onChangeText={(text) => setProfile({ ...profile, instituicao: text })}
                  placeholder="Nome da instituição"
                  placeholderTextColor="#a0a0a0"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Curso</Text>
                <TextInput
                  style={styles.input}
                  value={profile.curso}
                  onChangeText={(text) => setProfile({ ...profile, curso: text })}
                  placeholder="Nome do curso"
                  placeholderTextColor="#a0a0a0"
                />
              </View>
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: profile.cor }]} 
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: -20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    minHeight: 600,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  avatarLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  fieldsContainer: {
    marginBottom: 30,
  },
  fieldGroup: {
    marginBottom: 30,
  },
  fieldGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputHalf: {
    marginRight: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
