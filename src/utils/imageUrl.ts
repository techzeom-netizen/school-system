import { API_ROUTE } from '@/data/common-data';

const ASSETS_PREFIX = 'assets/';

const getAssetPath = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname.replace(/^\/+/, '');
    const assetsIndex = pathname.indexOf(ASSETS_PREFIX);

    if (assetsIndex >= 0) {
      return pathname.slice(assetsIndex + ASSETS_PREFIX.length);
    }

    return pathname;
  } catch {
    const normalized = trimmed.replace(/^\/+/, '');
    if (normalized.startsWith(ASSETS_PREFIX)) {
      return normalized.slice(ASSETS_PREFIX.length);
    }
    return normalized;
  }
};

export const toAssetImageUrl = (value?: string | null): string => {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (!API_ROUTE) {
    return trimmed;
  }

  const apiRoute = API_ROUTE.replace(/\/+$/, '');
  if (trimmed.startsWith(`${apiRoute}/assets/`)) {
    return trimmed;
  }

  const assetPath = getAssetPath(trimmed);
  return assetPath ? `${apiRoute}/assets/${assetPath}` : '';
};
