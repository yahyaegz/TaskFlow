import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    notifications: 'Notifications',
    settings: 'Settings',
    logout: 'Logout',
    all_tasks: 'All Tasks',
    categories: 'Categories',
    tags: 'Tags',
    welcome_back: 'Welcome back',
    search_tasks: 'Search tasks...',
    add_task: 'Add Task',
    pending: 'Pending',
    completed: 'Completed',
    total_tasks: 'Total Tasks',
    profile: 'Profile',
    preferences: 'Preferences',
    security: 'Security',
    language: 'Language',
    analytics: 'Analytics',
    theme: 'Theme',
    save_changes: 'Save Changes',
    save_preferences: 'Save Preferences',
    color_theme: 'Color Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    new_category: 'New Category...',
    new_tag: 'New Tag...',
    high_priority: 'high',
    medium_priority: 'medium',
    low_priority: 'low',
  },
  es: {
    dashboard: 'Tablero',
    notifications: 'Notificaciones',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    all_tasks: 'Todas las tareas',
    categories: 'Categorías',
    tags: 'Etiquetas',
    welcome_back: 'Bienvenido de nuevo',
    search_tasks: 'Buscar tareas...',
    add_task: 'Agregar tarea',
    pending: 'Pendientes',
    completed: 'Completadas',
    total_tasks: 'Tareas totales',
    profile: 'Perfil',
    preferences: 'Preferencias',
    security: 'Seguridad',
    language: 'Idioma',
    theme: 'Tema',
    save_changes: 'Guardar cambios',
    save_preferences: 'Guardar preferencias',
    color_theme: 'Tema de color',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    new_category: 'Nueva categoría...',
    new_tag: 'Nueva etiqueta...',
    high_priority: 'alta',
    medium_priority: 'media',
    low_priority: 'baja',
  },
  fr: {
    dashboard: 'Tableau de bord',
    notifications: 'Notifications',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    all_tasks: 'Toutes les tâches',
    categories: 'Catégories',
    tags: 'Étiquettes',
    welcome_back: 'Bon retour',
    search_tasks: 'Rechercher des tâches...',
    add_task: 'Ajouter une tâche',
    pending: 'En attente',
    completed: 'Terminé',
    total_tasks: 'Total des tâches',
    profile: 'Profil',
    preferences: 'Préférences',
    security: 'Sécurité',
    language: 'Langue',
    theme: 'Thème',
    save_changes: 'Enregistrer les modifications',
    save_preferences: 'Enregistrer les préférences',
    color_theme: 'Thème de couleur',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    new_category: 'Nouvelle catégorie...',
    new_tag: 'Nouvel onglet...',
    high_priority: 'haute',
    medium_priority: 'moyenne',
    low_priority: 'basse',
  },
  de: {
    dashboard: 'Dashboard',
    notifications: 'Benachrichtigungen',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    all_tasks: 'Alle Aufgaben',
    categories: 'Kategorien',
    tags: 'Tags',
    welcome_back: 'Willkommen zurück',
    search_tasks: 'Aufgaben suchen...',
    add_task: 'Aufgabe hinzufügen',
    pending: 'Ausstehend',
    completed: 'Abgeschlossen',
    total_tasks: 'Gesamtaufgaben',
    profile: 'Profil',
    preferences: 'Präferenzen',
    security: 'Sicherheit',
    language: 'Sprache',
    theme: 'Thema',
    save_changes: 'Änderungen speichern',
    save_preferences: 'Präferenzen speichern',
    color_theme: 'Farbthema',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
    new_category: 'Neue Kategorie...',
    new_tag: 'Neuer Tag...',
    high_priority: 'hoch',
    medium_priority: 'mittel',
    low_priority: 'niedrig',
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
