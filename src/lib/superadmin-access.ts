export interface SuperAdminAccessProfile {
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

/**
 * Returns the safe redirect target when a viewer cannot manage profile
 * visibility. A null result means access may continue.
 */
export function getSuperAdminAccessRedirect(
  profile: SuperAdminAccessProfile,
): "/" | "/admin" | null {
  if (profile.isSuperAdmin) return null;
  return profile.isAdmin ? "/admin" : "/";
}
