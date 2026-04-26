/**
 * Supported locales available to client-side consumers.
 */
export const locales = ["en-US", "es-MX"] as const;

/**
 * Union type for supported locale identifiers.
 */
export type Locale = (typeof locales)[number];

/**
 * Client-safe translation dictionary used by localized UI components.
 */
export type Dictionary = {
  metadata: {
    title: string;
    description: string;
  };
  layout: {
    openMenu: string;
    navigationLabel: string;
    moviesLink: string;
    producersLink: string;
    userLabel: string;
    logout: string;
    repository: string;
    copyright: string;
    languageLabel: string;
    languageNames: Record<Locale, string>;
  };
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    createMovie: string;
    createMovieTooltip: string;
    featuredTitle: string;
    featuredSubtitle: string;
    responsiveHint: string;
    movieColumn: string;
    yearColumn: string;
    actionColumn: string;
    detailsAction: string;
    detailsTooltip: string;
  };
  detail: {
    backAction: string;
    titleLabel: string;
    releaseDateLabel: string;
    durationLabel: string;
    durationUnit: string;
    ratingLabel: string;
    descriptionLabel: string;
    notFound: string;
    errorLoading: string;
  };
  producers: {
    title: string;
    subtitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    nameColumn: string;
    emptyState: string;
    errorLoading: string;
    invalidLanguage: string;
    detail: {
      backLink: string;
      notFound: string;
      errorLoading: string;
      loading: string;
      nameLabel: string;
      idLabel: string;
      profileLabel: string;
    };
    create: {
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      profileLabel: string;
      profilePlaceholder: string;
      profileHelper: string;
      save: string;
      saving: string;
      cancel: string;
      backToList: string;
      validation: {
        nameRequired: string;
        profileMaxLength: string;
      };
    };
  };
  movies: {
    create: {
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      launchDateLabel: string;
      durationLabel: string;
      ratingLabel: string;
      ratingPlaceholder: string;
      producerLabel: string;
      producerPlaceholder: string;
      producersLoading: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      descriptionHelper: string;
      save: string;
      saving: string;
      cancel: string;
      invalidLanguage: string;
    };
  };
};

/**
 * In-memory dictionary catalog for client-side localized content.
 */
const dictionaries: Record<Locale, Dictionary> = {
  "en-US": {
    metadata: {
      title: "Movies Application",
      description: "Movies frontend with English and Spanish support.",
    },
    layout: {
      openMenu: "Open menu",
      navigationLabel: "Navigation",
      moviesLink: "Movies",
      producersLink: "Producers",
      userLabel: "User: John Doe",
      logout: "Logout",
      repository: "GitHub Repository",
      copyright: "© 2026 Kikesoft",
      languageLabel: "Language",
      languageNames: {
        "en-US": "English (US)",
        "es-MX": "Spanish (MX)",
      },
    },
    home: {
      eyebrow: "Movies Application",
      title: "Movie List",
      subtitle: "Static preview with dummy data for the home screen.",
      createMovie: "Add Movie",
      createMovieTooltip: "Create a new movie",
      featuredTitle: "Featured Titles",
      featuredSubtitle: "Showing 5 demo records.",
      responsiveHint: "Mobile: stacked cards | Laptop: compact table | Desktop: spacious table",
      movieColumn: "Movie",
      yearColumn: "Release Year",
      actionColumn: "Action",
      detailsAction: "View Details",
      detailsTooltip: "View details for",
    },
    detail: {
      backAction: "Back to list",
      titleLabel: "Title",
      releaseDateLabel: "Release Date",
      durationLabel: "Duration",
      durationUnit: "min",
      ratingLabel: "Rating",
      descriptionLabel: "Description",
      notFound: "Movie not found",
      errorLoading: "Error loading movie",
    },
    producers: {
      title: "Producers List",
      subtitle: "Browse all producers available in the catalog.",
      featuredTitle: "Producers",
      featuredSubtitle: "Showing all records returned by the API.",
      nameColumn: "Producer",
      emptyState: "No producers found.",
      errorLoading: "Error loading producers",
      invalidLanguage: "Invalid language",
      detail: {
        backLink: "← Back to Producers",
        notFound: "Producer not found.",
        errorLoading: "Error loading producer.",
        loading: "Loading producer...",
        nameLabel: "Name",
        idLabel: "ID",
        profileLabel: "Profile",
      },
      create: {
        title: "Create Producer",
        subtitle: "Fill in producer information and save when all validations pass.",
        nameLabel: "Name",
        namePlaceholder: "Enter producer name",
        profileLabel: "Profile",
        profilePlaceholder: "Enter producer profile (optional)",
        profileHelper: "Optional. Maximum",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        backToList: "Back to producers",
        validation: {
          nameRequired: "Name is mandatory",
          profileMaxLength: "Profile must be at most",
        },
      },
    },
    movies: {
      create: {
        title: "Create Movie",
        subtitle: "Fill in the movie details and save when ready.",
        nameLabel: "Title",
        namePlaceholder: "Enter movie title",
        launchDateLabel: "Release Date",
        durationLabel: "Duration (min)",
        ratingLabel: "Rating",
        ratingPlaceholder: "-- Select rating --",
        producerLabel: "Producer",
        producerPlaceholder: "-- Select producer --",
        producersLoading: "Loading producers...",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Enter a description (optional)",
        descriptionHelper: "Optional. Maximum 1000 characters.",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        invalidLanguage: "Invalid language",
      },
    },
  },
  "es-MX": {
    metadata: {
      title: "Movies Application",
      description: "Frontend de películas con soporte para inglés y español.",
    },
    layout: {
      openMenu: "Abrir menú",
      navigationLabel: "Navegación",
      moviesLink: "Películas",
      producersLink: "Productores",
      userLabel: "Usuario: John Doe",
      logout: "Cerrar sesión",
      repository: "Repositorio en GitHub",
      copyright: "© 2026 Kikesoft",
      languageLabel: "Idioma",
      languageNames: {
        "en-US": "Inglés (EE. UU.)",
        "es-MX": "Español (MX)",
      },
    },
    home: {
      eyebrow: "Movies Application",
      title: "Lista de Películas",
      subtitle: "Vista previa estática con datos dummy para la pantalla principal.",
      createMovie: "Agregar Película",
      createMovieTooltip: "Crear una nueva película",
      featuredTitle: "Títulos Destacados",
      featuredSubtitle: "Mostrando 5 registros de demostración.",
      responsiveHint: "Móvil: tarjetas apiladas | Laptop: tabla compacta | Escritorio: tabla amplia",
      movieColumn: "Película",
      yearColumn: "Año de Estreno",
      actionColumn: "Acción",
      detailsAction: "Ver Detalles",
      detailsTooltip: "Ver detalles de",
    },
    detail: {
      backAction: "Volver a la lista",
      titleLabel: "Título",
      releaseDateLabel: "Fecha de estreno",
      durationLabel: "Duración",
      durationUnit: "min",
      ratingLabel: "Clasificación",
      descriptionLabel: "Descripción",
      notFound: "Película no encontrada",
      errorLoading: "Error al cargar la película",
    },
    producers: {
      title: "Lista de Productores",
      subtitle: "Consulta todos los productores disponibles en el catálogo.",
      featuredTitle: "Productores",
      featuredSubtitle: "Mostrando todos los registros devueltos por el API.",
      nameColumn: "Productor",
      emptyState: "No se encontraron productores.",
      errorLoading: "Error al cargar productores",
      invalidLanguage: "Idioma no válido",
      detail: {
        backLink: "← Volver a Productores",
        notFound: "Productor no encontrado.",
        errorLoading: "Error al cargar el productor.",
        loading: "Cargando productor...",
        nameLabel: "Nombre",
        idLabel: "ID",
        profileLabel: "Perfil",
      },
      create: {
        title: "Crear Productor",
        subtitle: "Completa la información del productor y guarda cuando todas las validaciones pasen.",
        nameLabel: "Nombre",
        namePlaceholder: "Ingresa el nombre del productor",
        profileLabel: "Perfil",
        profilePlaceholder: "Ingresa el perfil del productor (opcional)",
        profileHelper: "Opcional. Máximo",
        save: "Guardar",
        saving: "Guardando...",
        cancel: "Cancelar",
        backToList: "Volver a productores",
        validation: {
          nameRequired: "El nombre es obligatorio",
          profileMaxLength: "El perfil debe tener como máximo",
        },
      },
    },
    movies: {
      create: {
        title: "Crear Película",
        subtitle: "Completa los detalles de la película y guarda cuando estés listo.",
        nameLabel: "Título",
        namePlaceholder: "Ingresa el título de la película",
        launchDateLabel: "Fecha de Estreno",
        durationLabel: "Duración (min)",
        ratingLabel: "Clasificación",
        ratingPlaceholder: "-- Selecciona clasificación --",
        producerLabel: "Productor",
        producerPlaceholder: "-- Selecciona productor --",
        producersLoading: "Cargando productores...",
        descriptionLabel: "Descripción",
        descriptionPlaceholder: "Ingresa una descripción (opcional)",
        descriptionHelper: "Opcional. Máximo 1000 caracteres.",
        save: "Guardar",
        saving: "Guardando...",
        cancel: "Cancelar",
        invalidLanguage: "Idioma no válido",
      },
    },
  },
};

/**
 * Get the translation dictionary for a supported locale.
 * Safe for use inside Client Components.
 *
 * @param locale Locale code to resolve.
 * @returns Translation dictionary for the requested locale.
 */
export async function getClientDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
