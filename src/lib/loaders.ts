/**
 * Content loaders (Theo). Used only by src/content.config.ts.
 *
 * - `entryFolders()`  one entry per folder: `<collection>/<slug>/index.mdx`, read from BOTH
 *                     src/content/ (public, committed) and src/content-private/ (protected, gitignored,
 *                     committed only as sealed/content-private.sealed). The id is the folder name.
 *                     Placement is enforced: `protected: true` only in the private tree, and only
 *                     `protected: true` there. Ids must be unique across both trees.
 *                     In `astro build`, entries with `draft: true`, `visibility: draft` or
 *                     `confidentiality: pending` are dropped BEFORE validation and never reach the
 *                     store, so their MDX and media are never compiled or emitted. In `astro dev`
 *                     they load normally so they can be previewed (pages show a DRAFT badge).
 * - `yamlDocument()`  a single YAML file (src/data/*.yaml) as ONE entry. Unlike Astro's file()
 *                     loader it fails the build on a missing file or a YAML syntax error.
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob, type Loader, type LoaderContext } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';

type Raw = Record<string, unknown>;

/** True when frontmatter says this entry must never be published. */
export function isUnpublishable(data: Raw | undefined): boolean {
  if (!data) return false;
  return data.draft === true || data.visibility === 'draft' || data.confidentiality === 'pending';
}

const EXCLUDED = Symbol.for('enricortan.unpublishable');

/** `src/content-private/` holds the protected (FLNT) entries: gitignored, committed only sealed. */
export const PRIVATE_TREE = 'content-private';
const isPrivatePath = (file: string | undefined) => Boolean(file && file.replaceAll('\\', '/').includes(`/src/${PRIVATE_TREE}/`));

export function entryFolders(collection: 'work' | 'lab' | 'notes'): Loader {
  const inner = glob({
    // One folder per entry, in the public tree (src/content) and the private tree (src/content-private).
    // Folders starting with "_" (templates, scratch) are ignored.
    pattern: [`content/${collection}/**/index.mdx`, `${PRIVATE_TREE}/${collection}/**/index.mdx`, '!**/_*/**'],
    base: './src',
    // ".../flnt-maps/index.mdx" -> "flnt-maps"; nested ".../a/b/index.mdx" -> "b"
    generateId: ({ entry }) => path.posix.basename(path.posix.dirname(entry.replaceAll('\\', '/'))),
  });

  return {
    name: `entry-folders:${collection}`,
    load: async (context: LoaderContext) => {
      // `astro dev` shows drafts; every other command (build, check, sync) drops them.
      const dropUnpublishable = !import.meta.env.DEV;
      const seen = new Map<string, string>();

      const parseData: LoaderContext['parseData'] = async (props) => {
        const data = props.data as Raw;
        const where = (props.filePath ?? '').replaceAll('\\', '/').replace(/^.*\/src\//, 'src/');
        // Placement rule: protected entries live ONLY in the private tree, and everything there is protected.
        if (isPrivatePath(props.filePath) && data.protected !== true) {
          throw new Error(`[content] ${where}: every entry in src/${PRIVATE_TREE}/ must set \`protected: true\`.`);
        }
        if (!isPrivatePath(props.filePath) && data.protected === true) {
          throw new Error(
            `[content] ${where}: \`protected: true\` entries must live in src/${PRIVATE_TREE}/${collection}/ (gitignored, committed sealed), not in src/content/. Move the folder.`,
          );
        }
        const other = seen.get(props.id);
        if (other && other !== props.filePath && props.filePath && existsSync(other)) {
          throw new Error(`[content] two ${collection} entries are named "${props.id}": ${other} and ${props.filePath}.`);
        }
        if (props.filePath) seen.set(props.id, props.filePath);

        if (dropUnpublishable && isUnpublishable(data)) {
          context.logger.info(`skipped unpublished entry: ${collection}/${props.id}`);
          return { [EXCLUDED]: true } as never;
        }
        return context.parseData(props);
      };
      const store = new Proxy(context.store, {
        get(target, prop, receiver) {
          if (prop === 'set') {
            return (entry: { id: string; data: Raw }) => {
              if ((entry.data as Raw)?.[EXCLUDED as unknown as string]) {
                target.delete(entry.id);
                return false;
              }
              return target.set(entry as Parameters<typeof target.set>[0]);
            };
          }
          const value = Reflect.get(target, prop, receiver);
          return typeof value === 'function' ? value.bind(target) : value;
        },
      });
      return inner.load({ ...context, parseData, store });
    },
  };
}

export function yamlDocument(fileName: string, id: string): Loader {
  return {
    name: `yaml-document:${id}`,
    load: async ({ config, store, parseData, watcher, logger }) => {
      const filePath = fileURLToPath(new URL(fileName, config.root));
      const sync = async () => {
        if (!existsSync(filePath)) {
          throw new Error(`[content] ${fileName} is missing. It holds the "${id}" data the site needs.`);
        }
        let raw: unknown;
        try {
          raw = parseYaml(await readFile(filePath, 'utf-8'));
        } catch (error) {
          throw new Error(`[content] ${fileName} is not valid YAML: ${(error as Error).message}`);
        }
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
          throw new Error(`[content] ${fileName} must be a YAML mapping (key: value) at the top level.`);
        }
        const data = await parseData({ id, data: raw as Raw, filePath });
        store.clear();
        store.set({ id, data, filePath: path.relative(fileURLToPath(config.root), filePath).replaceAll('\\', '/') });
      };
      await sync();
      watcher?.add(filePath);
      watcher?.on('change', (changed) => {
        if (path.resolve(changed) === path.resolve(filePath)) {
          sync().catch((error) => logger.error((error as Error).message));
        }
      });
    },
  };
}
