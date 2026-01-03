export interface Config {
    locales: readonly string[];
    defaultLocale: string;
    localeCookie?: string;
    prefixDefault?: boolean;
    basePath?: string;
    serverSetCookie?: 'if-empty' | 'always' | 'never';
    // Here any is used instead of NextRequest because
    // The NextRequest type which is the type of request needs installation of the next library
    localeDetector?: ((request: any, config: Config) => string) | false;
}

export const i18nConfig: Config = {
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
    prefixDefault: false,
}
