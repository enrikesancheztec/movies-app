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
  },
  "es-MX": {
    metadata: {
      title: "Movies Application",
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
