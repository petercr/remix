import path from "node:path";
import fsp from "node:fs/promises";
import { read } from "to-vfile";
import { remark } from "remark";
import { remarkReferenceLinksBottom } from "@mcansh/remark-definition-links";
import remarkFrontmatter from "remark-frontmatter";
import glob from "glob";
import prettier from "prettier";

main();

async function main() {
  let files = glob.sync("**/*.md", {
    absolute: true,
    cwd: path.join(process.cwd(), "./docs"),
  });

  for (let file of files) {
    let result = await remark()
      .use(remarkReferenceLinksBottom)
      .use(remarkFrontmatter)
      .process(await read(file));

    await fsp.writeFile(
      file,
      prettier.format(result.toString(), { parser: "markdown" })
    );
  }
}
