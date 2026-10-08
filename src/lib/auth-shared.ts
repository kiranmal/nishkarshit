// Client-safe role/permission definitions (no server-only imports).
export type Role = "super_admin" | "admin" | "editor";
export const ROLES: { value: Role; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
];

/** Modular permissions. Add a permission here and list which roles hold it. */
export const PERMISSIONS = {
  content: ["super_admin", "admin", "editor"], // edit pages, sections, items
  media: ["super_admin", "admin", "editor"],
  delete: ["super_admin", "admin"], // destructive actions on content
  seo: ["super_admin", "admin"],
  forms: ["super_admin", "admin"], // view / manage submissions
  forms_delete: ["super_admin"],
  settings: ["super_admin"], // site-wide settings
  users: ["super_admin"], // user & role management
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

