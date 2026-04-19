import "server-only";

export const locales = ["en-US", "es-MX"] as const;

export type Locale = (typeof locales)[number];

type Dictionary = {
  metadata: {
    title: string;
    description: string;
  };
  layout: {
    openMenu: string;
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
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  "en-US": {
    metadata: {
      title: "Movies Application",
      description: "Movies frontend with English and Spanish support.",
    },
    layout: {
      openMenu: "Open menu",
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
    },
  },
  "es-MX": {
    metadata: {
      title: "Aplicación de Películas",
      description: "Frontend de películas con soporte para inglés y español.",
    },
    layout: {
      openMenu: "Abrir menú",
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
      eyebrow: "Aplicación de Películas",
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
      detailsAction: "Ver Detalle",
      detailsTooltip: "Ver detalle de",
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
    },
  },
};

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale];
}