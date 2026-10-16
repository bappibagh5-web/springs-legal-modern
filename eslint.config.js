import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Generated files, plus the Lovable-managed admin/CMS area. The admin code is kept as Lovable
// generated it (public pages don't use it), so it isn't reformatted here.
// Lint it anyway with: bun run lint:all
const ADMIN_AND_GENERATED = [
  "src/routeTree.gen.ts",
  "src/integrations/supabase/**",
  "src/routes/admin*.tsx",
  "src/components/admin/**",
  "src/lib/cms/**",
  "src/lib/ai-gateway.server.ts",
  "src/lib/{admin,analytics,automation,categories,posts,seo,settings,topics}.functions.ts",
];

export default tseslint.config(
  {
    ignores: [
      "dist",
      ".output",
      ".vinxi",
      ".wrangler",
      ...(process.env.LINT_ALL ? [] : ADMIN_AND_GENERATED),
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintPluginPrettier,
);
